import { useBoolean } from "..";
import { isRef } from "vue";

describe("useBoolean", () => {
    test("useBoolean should defined", () => {
        expect(useBoolean).toBeDefined();
    });

    test("test on methods", () => {
        const [bool, toggle] = useBoolean();

        expect(isRef(bool)).toBeTruthy();
        expect(bool.value).toBe(false);

        toggle();
        expect(bool.value).toBe(true);

        toggle(false);
        expect(bool.value).toBe(false);

        toggle({} as any);
        expect(bool.value).toBe(true);
    });
});
