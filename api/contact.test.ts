import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler, { parseContactPayload } from "./contact";

function mockRes() {
  const res: Partial<VercelResponse> & { statusCode?: number; body?: unknown } = {};
  res.status = vi.fn((code: number) => {
    res.statusCode = code;
    return res as VercelResponse;
  });
  res.json = vi.fn((data: unknown) => {
    res.body = data;
    return res as VercelResponse;
  });
  return res as VercelResponse & { statusCode?: number; body?: unknown };
}

describe("parseContactPayload", () => {
  it("akzeptiert ein gültiges Payload und trimmt Felder", () => {
    const result = parseContactPayload({ name: " Test ", email: " test@example.com ", message: " Hallo " });
    expect(result).toEqual({ name: "Test", email: "test@example.com", subject: undefined, message: "Hallo" });
  });

  it("lehnt fehlenden Namen ab", () => {
    expect(parseContactPayload({ name: "", email: "test@example.com", message: "Hallo" })).toBeNull();
  });

  it("lehnt eine ungültige E-Mail-Adresse ab", () => {
    expect(parseContactPayload({ name: "Test", email: "keine-email", message: "Hallo" })).toBeNull();
  });
});

describe("handler", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BREVO_API_KEY;
  });

  it("lehnt Nicht-POST-Requests mit 405 ab", async () => {
    const req = { method: "GET" } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("lehnt ungültige Payloads mit 400 ab", async () => {
    const req = { method: "POST", body: { name: "", email: "", message: "" } } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("ruft die Brevo-API mit dem API-Key auf und antwortet mit 200", async () => {
    const req = {
      method: "POST",
      body: { name: "Test Person", email: "test@example.com", message: "Testnachricht" },
    } as VercelRequest;
    const res = mockRes();
    await handler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "api-key": "test-key" }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("antwortet mit 500, wenn BREVO_API_KEY fehlt", async () => {
    delete process.env.BREVO_API_KEY;
    const req = {
      method: "POST",
      body: { name: "Test Person", email: "test@example.com", message: "Testnachricht" },
    } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("antwortet mit 502, wenn Brevo einen Fehler zurückgibt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const req = {
      method: "POST",
      body: { name: "Test Person", email: "test@example.com", message: "Testnachricht" },
    } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });
});
