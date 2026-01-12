#include <napi.h>

Napi::String HelloFromNative(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello From Native!!");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, HelloFromNative));
  return exports;
}

NODE_API_MODULE(addon, Init)
