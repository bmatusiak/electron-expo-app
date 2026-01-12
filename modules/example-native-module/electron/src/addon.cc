#include <napi.h>

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

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, HelloFromNative));
  exports.Set("multiply", Napi::Function::New(env, Multiply));
  return exports;
}

NODE_API_MODULE(addon, Init)
