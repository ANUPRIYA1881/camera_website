import { Hero } from '../components/Hero'
import { Precision } from '../components/Precision'
import { Collection } from '../components/Collection'
import { Showcase } from '../components/Showcase'
import { Gallery } from '../components/Gallery'
import { Accessories } from '../components/Accessories'
import { Story } from '../components/Story'
import { FinalCTA } from '../components/FinalCTA'

export function Home() {
  return (
    <>
      <Hero />
      <Precision />
      <Collection />
      <Showcase />
      <Gallery />
      <Accessories />
      <Story />
      <FinalCTA />
    </>
  )
}
