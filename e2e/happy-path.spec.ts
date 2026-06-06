import { test, expect } from "@playwright/test";

test("arrival happy path: home → interest → detail → reserve → save → saved", async ({
  page,
}) => {
  await page.goto("/en");

  // Personalized arrival context + ranked feed render immediately (no onboarding).
  await expect(page.getByText("You just landed at Iași (IAS)")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recommended for you" }),
  ).toBeVisible();

  // Filtering by an interest re-ranks matching places with an explainable reason.
  await page.getByRole("button", { name: "Wine", exact: true }).click();
  await expect(page.getByText("Because you like Wine").first()).toBeVisible();

  // Open a place detail.
  await page.getByRole("heading", { name: "Crama Bucium" }).first().click();
  await expect(page).toHaveURL(/\/place\/crama-bucium/);
  await expect(page.getByText("Why we recommend this")).toBeVisible();

  // Demo booking confirmation.
  await page.getByRole("button", { name: "Reserve" }).click();
  await expect(page.getByText("Reserved!")).toBeVisible();

  // Saving adds it to the trip, visible on the Saved page.
  await page.getByRole("button", { name: /Save ·/ }).click();
  await page.goto("/en/saved");
  await expect(
    page.getByRole("heading", { name: "Crama Bucium" }),
  ).toBeVisible();
});

test("airport services board switches between arrivals and departures", async ({
  page,
}) => {
  await page.goto("/en/fly");
  await expect(page.getByRole("heading", { name: "My Flight" })).toBeVisible();
  await expect(page.getByText("London Luton")).toBeVisible();

  await page.getByRole("tab", { name: "Departures" }).click();
  await expect(page.getByText("Bucharest")).toBeVisible();
});

test("transport page lists ways into the city", async ({ page }) => {
  await page.goto("/en/transport");
  await expect(page.getByRole("heading", { name: "Getting to Iași" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Taxi" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Car rental" })).toBeVisible();
});
