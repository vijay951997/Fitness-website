# Photos

Drop your images in this folder with these exact filenames and they appear
on the site automatically. If a file is missing, that slot falls back to a
dark gradient — nothing breaks.

| Filename             | Where it appears           | Suggested crop      |
| -------------------- | -------------------------- | ------------------- |
| `vijay.jpg`          | Hero background, and About | Portrait, 1200×1500 |
| `vijay-coaching.jpg` | Not currently used         | Portrait, 1200×1500 |

## Current state

`vijay.jpg` is your gym photo and is used in **two places** — the hero
background and the About section — framed differently in each. That works,
but a second, different photo would be better. Add one as
`vijay-coaching.jpg` and point the About section at it by changing the
`src` in `src/components/About.tsx`.

## Tips

- **A second shot** — ideally you coaching someone, or a clear face-forward
  portrait. Hands-on cueing converts better than a posed gym selfie.
- The hero crops to a wide letterbox on desktop, so a **landscape or square**
  photo suits it far better than a portrait one.
- Keep each file under about 400 KB. Compress at <https://squoosh.app>.
- JPG is fine. If you use a different extension, update the `src` values in
  `src/components/Hero.tsx` and `src/components/About.tsx`.
