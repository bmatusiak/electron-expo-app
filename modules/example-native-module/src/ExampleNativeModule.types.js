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
 */

export { };
