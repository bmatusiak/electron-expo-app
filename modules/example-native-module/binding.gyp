{
  "targets": [
    {
      "target_name": "example-native-module",
      "sources": [ "native/addon.cc" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include.replace(/^-I\\s*/,'').replace(/^\\\"|\\\"$/g,'')\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    }
  ]
}
