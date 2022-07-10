import { Badge, Button, Card, Container, Text } from "@mantine/core";
import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Rinkeby, useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { FloorItem } from "../../../hooks/Floors/Floors";
import { ScrollableGroup } from "../../controls/ScrollableGroup";
import { Floor } from "../../models";
import { FloorCreationModal } from "../FloorCreationModal";

export type InfinityTowerProps = {
  floors: FloorItem[];
};

export const InfinityTower = ({ floors }: InfinityTowerProps) => {
  const [floorCreationOpened, setFloorCreationOpened] = useState(false);
  const { account, chainId } = useEthers();
  // Handle scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="InfinityTowerCanvasWrapper">
        <Canvas camera={{ position: [-12, 1, 14], fov: 35, near: 1, far: 100 }}>
          <ScrollableGroup scroll={scrollPosition}>
            <ambientLight intensity={0.5} />
            <pointLight position={[20, 30, 10]} />
            <pointLight position={[-10, -10, -10]} color="blue" />
            <spotLight position={[-2, 1, 32]} angle={0.2} intensity={1} />
            <ContactShadows
              scale={12}
              blur={4}
              opacity={1}
              far={100}
              position={[0, -0.001, 0]}
            />
          </ScrollableGroup>
          <ScrollableGroup scroll={scrollPosition} rotationSpeed={0.28}>
            {floors.map((floor, index) => (
              <Floor
                position={[0, index * 2, 0]}
                rotation={[0, Math.PI * index * 0.08, 0]}
                key={index}
                color={floor.color}
                windowsTint={floor.windowsTint}
              />
            ))}
          </ScrollableGroup>
          <EffectComposer>
            <Noise opacity={0.08} />
          </EffectComposer>
        </Canvas>
      </div>
      {floors.map((floor, index) => (
        <Container
          key={index}
          sx={{
            pointerEvents: "none",
            maxWidth: 1200,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Card shadow="md" sx={{ width: 300 }}>
            <Badge>Floor #{index}</Badge>
            <Text weight={"bolder"}>{floor.ownerName}</Text>
            <Text>{floor.message}</Text>
            <Text
              variant="link"
              component="a"
              href={floor.link}
              target="_blank"
            >
              {floor.link}
            </Text>
          </Card>
        </Container>
      ))}
      <Button
        onClick={() => setFloorCreationOpened(true)}
        variant="light"
        radius="xl"
        disabled={!account || chainId !== Rinkeby.chainId}
        sx={{
          position: "fixed",
          bottom: 42,
          right: 42,
        }}
      >
        Mint a new floor
      </Button>
      <FloorCreationModal
        opened={floorCreationOpened}
        onClose={() => setFloorCreationOpened(false)}
      />
    </>
  );
};
