import event from "./event";

const EventHub = event();

const useEventEmitter = () => EventHub;

export default useEventEmitter;
