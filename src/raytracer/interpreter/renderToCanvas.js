import { Rt } from '../model.js';
import { pipe } from '../utility/index.js';
import { calculate } from './calculate.js';

const identityMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const renderToCanvas = ({ ctx, width, height, cameraPosition, cameraPitch, cameraYaw, cameraFOV, objects, skyShader, maxBounces }) => {
  const camPosCalculated = calculate(cameraPosition);

  const halfFovTan = Math.tan(calculate(Rt.degToRad(cameraFOV)) / 2);
  const greaterDimension = Math.max(width, height);

  const cameraPitchRad = calculate(Rt.degToRad(cameraPitch));
  const cameraYawRad = calculate(Rt.degToRad(cameraYaw));
  const cameraMatrix = calculate(Rt.map(
    identityMatrix,
    vector => Rt.rotateZ(Rt.rotateX(vector, cameraPitchRad), cameraYawRad),
  ));

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  const totalPixels = width * height;
  let pixelsDone = 0;
  const pixelDone = () => {
    pixelsDone++;
    if (pixelsDone == totalPixels) console.log(`Rendered ${width}x${height} pixels in ${(Date.now() - startTime) / 1000} seconds`);
  }
  console.log('Starting render...');
  const startTime = Date.now();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      setTimeout(() => {
        const pixel = calculate(
          pipe(Rt.rayColor, Rt.colorToString)(
            camPosCalculated,
            calculate(
              Rt.applyTransformMatrix(
                Rt.normalize(
                  [
                    halfFovTan * ((x + 0.5) / width - 0.5) * 2 * (width / greaterDimension),
                    halfFovTan * ((y + 0.5) / height - 0.5) * -2 * (height / greaterDimension),
                    -1,
                  ],
                ),
                cameraMatrix,
              ),
            ),
            objects,
            skyShader,
            maxBounces,
          ),
        );
        ctx.fillStyle = pixel;
        ctx.fillRect(x, y, 1, 1);
        pixelDone();
      });
    }
  }
}

export { renderToCanvas }
