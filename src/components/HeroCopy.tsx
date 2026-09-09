import { content } from '../content'

/** The intro headline — sits above the 3D hero object; supporting copy and the
 * scroll cue sit below it, so the object stays visually centered between them. */
export function HeroCopy() {
  return (
    <h1 className="hero-copy-title">
      {content.hero.titleLine1}
      <br />
      {content.hero.titleLine2}
    </h1>
  )
}
