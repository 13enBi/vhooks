import { extend } from "../utils";
import createInstance from "./createInstance";
import defaultConfig from "./default";

export default extend(createInstance(defaultConfig), { create: createInstance });
