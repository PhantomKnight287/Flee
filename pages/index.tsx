import { FeaturesGrid } from "@components/landing";
import { MetaTags } from "@components/Meta";
import { useUser } from "@hooks/user";
import { Button, Container, Grid, Group } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  const user = useUser();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <MetaTags
        title="Flee"
        description="Share Your Thoughts or Views Anonymously"
      />
      <FeaturesGrid
        description="Share Your Thoughts or Views Anonymously"
        title="Flee"
      />
      <Container>
        <Group position="center">
          <Button
            className="cursor-pointer text-white bg-black hover:scale-110 duration-[110ms] hover:bg-gray-900"
            component={Link}
            href="/auth"
          >
            Get Started
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default Home;
