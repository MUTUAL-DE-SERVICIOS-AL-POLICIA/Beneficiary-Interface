"use client"
import { Card, CardBody } from "@nextui-org/card";
import { ReactNode } from "react";

export default function ProfileLayout ({ children }: { children: ReactNode}) {

  return (
    <Card
      className="grow border-small rounded-small border-default-200 dark:border-default-100"
      style={{
        width: '940px',
        height: 'auto',
      }}
    >
      <CardBody className="justify-between">
        <div className="flex flex-row gap-5 md:py-5 md:px-4">
          { children }
        </div>
      </CardBody>
    </Card>
  )
}