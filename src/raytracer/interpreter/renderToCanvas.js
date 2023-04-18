// ImageData and render loop method based specifically on http://www.etwright.org/cghist/juggler_rt.html

import { Rt } from '../model.js';
import { pipe } from '../utility/index.js';
import { calculate } from './calculate.js';

const requestAnimFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
const clampZeroOne = value => Math.min(Math.max(0, value), 1);
const identityMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const renderToCanvas = ({ ctx, width, height, cameraPosition, cameraPitch, cameraYaw, cameraFOV, objects, skyShader, maxBounces }) => {
  const imgData = ctx.createImageData(width, height);

  const camPosCalculated = calculate(cameraPosition);

  const halfFovTan = Math.tan(calculate(Rt.degToRad(cameraFOV)) / 2);
  const greaterDimension = Math.max(width, height);

  const cameraPitchRad = calculate(Rt.degToRad(cameraPitch));
  const cameraYawRad = calculate(Rt.degToRad(cameraYaw));
  const cameraMatrix = calculate(Rt.map(
    identityMatrix,
    vector => Rt.rotateZ(Rt.rotateX(vector, cameraPitchRad), cameraYawRad),
  ));

  console.log('Starting render...');
  const startTime = Date.now();

  let x = 0, y = 0;
  const renderLoop = () => {
    while (true) {
      const imgDataOffset = 4 * (y * width + x);
      const pixelColorZeroToOne = calculate(
        Rt.rayColor(
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

      for (let i = 0; i < 3; i++) {
        imgData.data[imgDataOffset + i] = clampZeroOne(pixelColorZeroToOne[i]) * 255;
      }
      imgData.data[imgDataOffset + 3] = 255;

      x++;
      if (x === width) {
        // New line
        x = 0;
        y ++;
        ctx.putImageData(imgData, 0, 0);
        if (y < height) {
          requestAnimFrame(renderLoop);
        } else {
          console.log(`Rendered ${width}x${height} pixels in ${(Date.now() - startTime) / 1000} seconds`);
        }
        break;
      }
    }
  };

  renderLoop();
}

export { renderToCanvas }
