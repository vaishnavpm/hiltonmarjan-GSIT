import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
await mkdir("verification", { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Users/vaish/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
try {
  for (const width of [1920, 1366, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 1080 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.mouse.move(-10, -10);
    await page.goto("http://127.0.0.1:5173");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const state = () =>
      page.evaluate(() => {
        const alpha = (sel) => {
          const s = getComputedStyle(document.querySelector(sel));
          return s.visibility === "hidden" ? 0 : +s.opacity;
        };
        return {
          title: alpha(".project-heading"),
          details: alpha(".project-details"),
        };
      });
    assert.equal((await state()).details, 0);
    assert.equal(
      await page.locator(".hero-details-control, .skip-projects").count(),
      0,
    );
    await page.screenshot({ path: "verification/" + width + "-hero.png" });
    await page
      .locator(".project-stage")
      .hover({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(1100);
    assert.equal((await state()).details, 1);
    assert.equal((await state()).title, 0);
    await page.screenshot({ path: "verification/" + width + "-details.png" });
    await page.mouse.move(-10, -10);
    await page.waitForTimeout(1100);
    assert.equal((await state()).title, 1);
    assert.equal((await state()).details, 0);
    for (const fraction of [0.2, 0.3, 0.5, 0.9]) {
      await page.evaluate(
        (f) =>
          window.scrollTo({ top: innerHeight * 1.2 * f, behavior: "instant" }),
        fraction,
      );
      await page.waitForTimeout(900);
      const s = await state();
      assert.ok(
        !(s.title > 0.01 && s.details > 0.01),
        "overlap " + JSON.stringify(s),
      );
    }
    for (const id of ["about", "expertise", "awards", "contact"]) {
      await page.locator("#" + id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1400);
      await page
        .locator("#" + id)
        .screenshot({ path: "verification/" + width + "-" + id + ".png" });
    }
    assert.equal(
      await page
        .locator(".service-row button, .row-action, .engineering-copy")
        .count(),
      0,
    );
    assert.equal(
      await page
        .locator(".hero-block, .architecture-block, .address-block")
        .count(),
      3,
    );
    const align = await page.evaluate(() => {
      const center = (el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      };
      return Math.abs(
        center(document.querySelector(".office-tabs button:nth-child(2)")) -
          center(document.querySelector(".office-details p")),
      );
    });
    assert.ok(align < 1, "Dubai/address alignment: " + align);
    if (width === 1920) {
      assert.equal(
        await page
          .locator(".plus-icon img")
          .first()
          .evaluate((el) => el.getBoundingClientRect().width),
        40,
      );
      assert.equal(
        await page
          .locator(".contact-plus img")
          .evaluate((el) => el.getBoundingClientRect().width),
        75,
      );
      const lines = await page
        .locator(".award-title span")
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
      assert.equal(new Set(lines).size, 4);
    }
    await page.locator(".copyright").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const before = await page
      .locator(".wordmark-track")
      .evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(300);
    const after = await page
      .locator(".wordmark-track")
      .evaluate((el) => getComputedStyle(el).transform);
    assert.notEqual(before, after, "marquee must move");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    console.log(
      width +
        "px: hover/reverse, scroll, blocks, alignment, marquee and overflow passed",
    );
    await page.close();
  }
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  await touch.goto("http://127.0.0.1:5173");
  await touch.locator(".project-stage").tap({ position: { x: 100, y: 100 } });
  assert.equal(
    await touch.locator(".project-details").getAttribute("aria-hidden"),
    "false",
  );
  await touch.locator(".project-stage").tap({ position: { x: 100, y: 100 } });
  assert.equal(
    await touch.locator(".project-details").getAttribute("aria-hidden"),
    "true",
  );
  assert.equal(await touch.locator(".pin-spacer").count(), 0);
  await touch.locator(".hero").evaluate((el) => el.blur());
  await touch.locator(".hero").focus();
  assert.equal(
    await touch.locator(".project-details").getAttribute("aria-hidden"),
    "false",
  );
  console.log("Reduced motion: touch toggle, keyboard focus and no pin passed");
} finally {
  await browser.close();
}
