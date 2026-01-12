#include <napi.h>

class SetValueWorker : public Napi::AsyncWorker {
 public:
  SetValueWorker(Napi::Env env,
                 std::string value,
                 Napi::Function notify,
                 Napi::Promise::Deferred deferred)
      : Napi::AsyncWorker(env),
        value_(std::move(value)),
        deferred_(deferred),
        notify_(Napi::Persistent(notify)) {}

  void Execute() override {
    // Intentionally empty for now. Real native work could go here.
  }

  void OnOK() override {
    // OnOK runs on the JS thread, so we can safely call the callback directly.
    try {
      notify_.Call({Napi::String::New(Env(), value_)});
    } catch (const std::exception& e) {
      // Swallow callback errors to keep Promise semantics predictable.
    }
    deferred_.Resolve(Env().Undefined());
  }

  void OnError(const Napi::Error& e) override {
    deferred_.Reject(e.Value());
  }

 private:
  std::string value_;
  Napi::Promise::Deferred deferred_;
  Napi::FunctionReference notify_;
};

Napi::String HelloFromNative(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello From Native!!");
}

Napi::Number Multiply(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "multiply expects two numbers").ThrowAsJavaScriptException();
    return Napi::Number::New(env, 0);
  }
  const double a = info[0].As<Napi::Number>().DoubleValue();
  const double b = info[1].As<Napi::Number>().DoubleValue();
  return Napi::Number::New(env, a * b);
 }

Napi::Value SetValueAsync(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsString() || !info[1].IsFunction()) {
    Napi::TypeError::New(env, "setValueAsync expects (value: string, notify: function)")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const std::string value = info[0].As<Napi::String>().Utf8Value();
  Napi::Function notify = info[1].As<Napi::Function>();
  auto deferred = Napi::Promise::Deferred::New(env);

  auto* worker = new SetValueWorker(env, value, notify, deferred);
  worker->Queue();
  return deferred.Promise();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, HelloFromNative));
  exports.Set("multiply", Napi::Function::New(env, Multiply));
  exports.Set("setValueAsync", Napi::Function::New(env, SetValueAsync));
  return exports;
}

NODE_API_MODULE(addon, Init)
