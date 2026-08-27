# Photos

Drop your images in this folder with these exact filenames and they appear
on the site automatically. Until a file exists, the site shows a tasteful
green gradient instead — nothing breaks.

| Filename             | Where it appears        | Suggested crop     |
| -------------------- | ----------------------- | ------------------ |
| `vijay.jpg`          | Hero, top right         | Portrait, 1200×1500 |
| `vijay-coaching.jpg` | About section           | Portrait, 1200×1500 |

## Tips

- **Portrait (`vijay.jpg`)** — you, well lit, looking at the camera. Gym or
  neutral background. This is the single most important image on the page.
- **Coaching shot (`vijay-coaching.jpg`)** — you actually coaching someone.
  Hands-on cueing works far better than a posed gym selfie.
- Keep each file under about 400 KB. Compress at <https://squoosh.app>.
- JPG is fine. If you use a different extension, update the `src` values in
  `src/components/Hero.tsx` and `src/components/About.tsx`.
