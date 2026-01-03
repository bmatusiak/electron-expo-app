#include <napi.h>

Napi::Number Multiply(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Expected two numbers").ThrowAsJavaScriptException();
    return Napi::Number::New(env, 0);
  }
  double a = info[0].As<Napi::Number>().DoubleValue();
  double b = info[1].As<Napi::Number>().DoubleValue();
  return Napi::Number::New(env, a * b);
}

Napi::String HelloFromNative(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello From Native");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("multiply", Napi::Function::New(env, Multiply));
  exports.Set("hello", Napi::Function::New(env, HelloFromNative));
  return exports;
}

NODE_API_MODULE(multiply, Init)
