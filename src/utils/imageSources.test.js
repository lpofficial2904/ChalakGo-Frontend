import test from "node:test";
import assert from "node:assert/strict";
import { imageSources } from "./imageSources.js";

test("uploaded images have responsive sizes and external signed images stay intact", () => {
  const responsive = imageSources("https://api.chalakgo.com/uploads/123-456.png", "160px");
  assert.match(responsive.srcSet, /w=320 320w/);
  assert.equal(responsive.sizes, "160px");
  for (const src of ["https://example.com/signed.jpg?token=abc", "/uploads/example.png?signature=abc", "data:image/png;base64,abc", "/uploads/animated.gif"])
    assert.deepEqual(imageSources(src), { src });
  assert.match(imageSources("https://images.unsplash.com/photo-123?w=2000&q=95").src, /q=78/);
});
