import React from "react";
import { Composition } from "remotion";
import { Reel1 } from "./Reel1";
import { Reel2 } from "./Reel2";
export const Root: React.FC = () => (<>
  <Composition id="Reel1" component={Reel1} durationInFrames={1800} fps={30} width={1080} height={1920} />
  <Composition id="Reel2" component={Reel2} durationInFrames={1800} fps={30} width={1080} height={1920} />
</>);
