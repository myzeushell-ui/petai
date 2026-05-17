"""Record HD screencasts of PetAI scenes via Playwright.

Requires petai prod server on http://localhost:3030.
Outputs: docs/video-assets/screencasts/scene-XX.webm

v2: English UI, longer/slower scenes synced with -25% voiceover.
"""
import asyncio
from pathlib import Path

from playwright.async_api import async_playwright, Page

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "screencasts"
OUT_DIR.mkdir(exist_ok=True)

BASE = "http://localhost:3030"
VIEWPORT = {"width": 1440, "height": 900}


async def pause(ms: int) -> None:
    await asyncio.sleep(ms / 1000)


async def click_button(page: Page, name: str, timeout: int = 3000) -> bool:
    try:
        await page.get_by_role("button", name=name, exact=False).first.click(timeout=timeout)
        return True
    except Exception as e:
        print(f"  ! click '{name}': {e.__class__.__name__}")
        return False


# Scene 2 (~13 sec VO): breed quiz/list → marketplace
async def scene_2(page: Page) -> None:
    await page.goto(f"{BASE}/breeds", wait_until="domcontentloaded", timeout=20000)
    await pause(3000)
    await page.evaluate("window.scrollBy({top: 300, behavior: 'smooth'})")
    await pause(2500)
    await page.evaluate("window.scrollBy({top: 300, behavior: 'smooth'})")
    await pause(2500)
    await page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")
    await pause(1500)
    await page.goto(f"{BASE}/marketplace", wait_until="domcontentloaded", timeout=20000)
    await pause(4500)


# Scene 3 (~19 sec VO): dashboard → labs → nutrition
async def scene_3(page: Page) -> None:
    await page.goto(f"{BASE}/dashboard", wait_until="domcontentloaded", timeout=20000)
    await pause(4500)
    await page.evaluate("window.scrollBy({top: 250, behavior: 'smooth'})")
    await pause(3000)
    await page.goto(f"{BASE}/labs", wait_until="domcontentloaded", timeout=20000)
    await pause(4000)
    await page.goto(f"{BASE}/nutrition", wait_until="domcontentloaded", timeout=20000)
    await pause(5000)


# Scene 4 (~12 sec VO): assistant → consultations → book → pay → success
async def scene_4(page: Page) -> None:
    await page.goto(f"{BASE}/assistant", wait_until="domcontentloaded", timeout=20000)
    await pause(2500)
    await page.goto(f"{BASE}/consultations", wait_until="domcontentloaded", timeout=20000)
    await pause(2000)
    await click_button(page, "Dog Trainer")
    await pause(1500)
    try:
        cards = page.locator(".cursor-pointer")
        if await cards.count() > 0:
            await cards.first.click()
    except Exception:
        pass
    await pause(2500)
    await click_button(page, "Book a session")
    await pause(1500)
    await click_button(page, "15:30")
    await pause(1000)
    await click_button(page, "Continue to payment")
    await pause(1500)
    await click_button(page, "Pay")
    await pause(3500)


# Scene 5 (~14 sec VO): breeding tabs
async def scene_5(page: Page) -> None:
    await page.goto(f"{BASE}/breeding", wait_until="domcontentloaded", timeout=20000)
    await pause(4000)
    await click_button(page, "Mating match")
    await pause(3500)
    await click_button(page, "COI calculator")
    await pause(3500)
    await click_button(page, "Breeding contract")
    await pause(1500)
    await click_button(page, "Generate contract PDF")
    await pause(3000)


# Scene 6 (~13 sec VO): create listing 4 steps
async def scene_6(page: Page) -> None:
    await page.goto(f"{BASE}/marketplace/new", wait_until="domcontentloaded", timeout=20000)
    await pause(3000)
    await click_button(page, "Next → Photos")
    await pause(3000)
    await click_button(page, "Next → Documents")
    await pause(3000)
    await click_button(page, "Next → Publish")
    await pause(2500)
    await click_button(page, "Publish")
    await pause(3000)


# Scene 7 (~19 sec VO): collar metrics + waveform + emotions
async def scene_7(page: Page) -> None:
    await page.goto(f"{BASE}/collar", wait_until="domcontentloaded", timeout=20000)
    await pause(6000)
    await page.evaluate("window.scrollBy({top: 250, behavior: 'smooth'})")
    await pause(5000)
    await page.evaluate("window.scrollBy({top: 350, behavior: 'smooth'})")
    await pause(6000)


SCENES = [
    ("02", scene_2),
    ("03", scene_3),
    ("04", scene_4),
    ("05", scene_5),
    ("06", scene_6),
    ("07", scene_7),
]


async def record_scene(scene_id: str, action) -> Path:
    scene_dir = OUT_DIR / f"_tmp_scene_{scene_id}"
    scene_dir.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport=VIEWPORT,
            record_video_dir=str(scene_dir),
            record_video_size=VIEWPORT,
            device_scale_factor=1.0,
        )
        page = await context.new_page()
        await page.goto(f"{BASE}/dashboard", wait_until="domcontentloaded", timeout=30000)
        try:
            await page.wait_for_selector("aside", timeout=10000)
        except Exception:
            pass
        await pause(2000)
        await action(page)
        await pause(400)
        await context.close()
        await browser.close()

    webms = list(scene_dir.glob("*.webm"))
    if not webms:
        raise RuntimeError(f"No webm produced for scene {scene_id}")
    src = webms[0]
    dst = OUT_DIR / f"scene-{scene_id}.webm"
    if dst.exists():
        dst.unlink()
    src.rename(dst)
    try:
        scene_dir.rmdir()
    except OSError:
        pass
    return dst


async def main() -> None:
    for sid, action in SCENES:
        print(f"-> Recording scene {sid}...")
        path = await record_scene(sid, action)
        size_kb = path.stat().st_size / 1024
        print(f"   OK: {path.name} ({size_kb:.0f} KB)")
    print("\nAll screencasts recorded.")


if __name__ == "__main__":
    asyncio.run(main())
