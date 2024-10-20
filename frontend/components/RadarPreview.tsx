import React from 'react'
import { IconContainer } from './IconContainer'
import { Radar } from './Radar'
import { AiFillDollarCircle } from 'react-icons/ai'
import { BsClipboardDataFill } from 'react-icons/bs'
import { BiSolidReport } from 'react-icons/bi'
import { HiMiniDocumentArrowUp } from 'react-icons/hi'  
import { HiDocumentReport } from 'react-icons/hi'
import { RiFilePaper2Fill } from 'react-icons/ri'

function RadarPreview() {
  return (
    <div className="relative flex h-96 w-full flex-col items-center justify-center space-y-4 overflow-hidden px-4">
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex w-full  items-center justify-center space-x-10 md:justify-between md:space-x-0 ">
        <IconContainer text="Food" delay={0.2} />
        <IconContainer
          delay={0.4}
          text="Rooms"
          icon={<AiFillDollarCircle className=" h-8 w-8 text-slate-600" />}
        />
        <IconContainer
          text="Amenities"
          delay={0.3}
          icon={
          <BsClipboardDataFill className=" h-8 w-8 text-slate-600" />
        }
        />
      </div>
    </div>
    <div className="mx-auto w-full max-w-md">
      <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0 ">
        <IconContainer
          text="Checkout"
          delay={0.5}
          icon={<BiSolidReport className=" h-8 w-8 text-slate-600" />}
        />
        <IconContainer
          text="Floor Plans"
          icon={
            <HiMiniDocumentArrowUp className=" h-8 w-8 text-slate-600" />
          }
          delay={0.8}
        />
      </div>
    </div>
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0 ">
        <IconContainer
          delay={0.6}
          text="Loyalty"
          icon={<HiDocumentReport className=" h-8 w-8 text-slate-600" />}
        />
        <IconContainer
          delay={0.7}
          text="Satisfaction"
          icon={<RiFilePaper2Fill className=" h-8 w-8 text-slate-600" />}
        />
      </div>
    </div>

    <Radar className="absolute -bottom-12" />
    <div className="absolute bottom-0 z-[41] h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
  </div>

  )
}

export default RadarPreview
