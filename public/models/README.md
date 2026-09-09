# Model assets

Drop real, optimized (Draco-compressed) GLB files here with these exact names
and the app picks them up automatically — no code changes required:

- `raw-chicken.glb` — realistic raw chicken drumstick, origin at the object's
  center, long axis along +Y (bone tip up, meat tip down), roughly matching
  the proportions of the built-in procedural drumstick (`src/three/geometry/
  drumstick.ts`) so the hidden model-swap and camera framing stay correct.
- `fried-chicken.glb` — matching crispy fried version, same scale/orientation.

Until these exist, `src/three/RawChicken.tsx` and `FriedChicken.tsx` fall
back to a procedurally generated drumstick (lathe geometry + a custom GLSL
shader) that is deliberately shaped and shaded to read clearly as a chicken
drumstick at every stage — not a placeholder blob.
