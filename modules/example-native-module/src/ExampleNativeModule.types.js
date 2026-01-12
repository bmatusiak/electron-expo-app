/**
 * @typedef {{ url: string }} OnLoadEventPayload
 * @typedef {{ value: string }} ChangeEventPayload
 *
 * @typedef {{
 *   onChange: (params: ChangeEventPayload) => void;
 * }} ExampleNativeModuleEvents
 *
 * @typedef {{
 *   url: string;
 *   onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
 *   style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
 * }} ExampleNativeModuleViewProps
 *
 * @typedef {{
 *   PI: number;
 *   hello: () => string;
 *   multiply: (a: number, b: number) => number;
 *   setValueAsync: (value: string) => Promise<void>;
 * }} ExampleNativeModuleApi
 */

export { };
