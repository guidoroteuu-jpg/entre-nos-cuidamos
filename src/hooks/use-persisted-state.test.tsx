// @vitest-environment jsdom
import { StrictMode, createElement } from "react";
import { renderToString } from "react-dom/server";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePersistedState } from "./use-persisted-state";

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("browser-persisted state", () => {
  it("does not access browser storage during server render", () => {
    const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage is unavailable on the server");
    });
    function Probe() {
      const [state] = usePersistedState("protocolos", ["default"]);
      return createElement("div", null, state.join(","));
    }
    expect(renderToString(createElement(Probe))).toContain("default");
    expect(read).not.toHaveBeenCalled();
  });

  it("restores saved data before writing, including under StrictMode", () => {
    localStorage.setItem("protocolos", JSON.stringify(["saved"]));
    const writes = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() => usePersistedState("protocolos", ["default"]), {
      wrapper: ({ children }) => createElement(StrictMode, null, children),
    });
    expect(result.current[0]).toEqual(["saved"]);
    expect(writes.mock.calls.every(([, value]) => value === '["saved"]')).toBe(true);
    act(() => result.current[1](["updated"]));
    expect(localStorage.getItem("protocolos")).toBe('["updated"]');
  });
});