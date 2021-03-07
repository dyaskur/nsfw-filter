import { NSFWJS, predictionType } from 'nsfwjs'

import { ILogger } from '../utils/Logger'

export type ModelSettings = {
  filterStrictness: number
}

type IModel = {
  predictImage: (image: HTMLImageElement, url: string) => Promise<boolean>
  setSettings: (settings: ModelSettings) => void
}

export class Model implements IModel {
  private readonly model: NSFWJS
  private readonly logger: ILogger
  private filterStrictness: number

  private readonly FILTER_LIST: Set<string>
  private readonly firstFilterPercentages: Map<string, number>
  private readonly secondFilterPercentages: Map<string, number>
  private readonly thirdFilterPercentages: Map<string, number>

  constructor (model: NSFWJS, logger: ILogger, settings: ModelSettings) {
    this.model = model
    this.logger = logger

    this.logger.log('Model is loaded')

    this.FILTER_LIST = new Set(['Hentai', 'Porn', 'Sexy'])

    this.firstFilterPercentages = new Map()
    this.secondFilterPercentages = new Map()
    this.thirdFilterPercentages = new Map()
    this.filterStrictness = settings.filterStrictness
    this.setSettings(settings)
  }

  public setSettings (settings: ModelSettings): void {
    this.filterStrictness = settings.filterStrictness

    this.firstFilterPercentages.clear()
    this.secondFilterPercentages.clear()
    this.thirdFilterPercentages.clear()

    for (const className of this.FILTER_LIST.values()) {
      this.firstFilterPercentages.set(
        className,
        this.handleFilterStrictness({
          maxValue: 100,
          minValue: className === 'Porn' ? 40 : 60
        })
      )
    }

    for (const className of this.FILTER_LIST.values()) {
      this.secondFilterPercentages.set(
        className,
        this.handleFilterStrictness({
          maxValue: 50,
          minValue: className === 'Porn' ? 5 : 25
        })
      )
    }

    for (const className of this.FILTER_LIST.values()) {
      this.thirdFilterPercentages.set(
        className,
        this.handleFilterStrictness({
          maxValue: 20,
          minValue: className === 'Porn' ? 5 : 15
        })
      )
    }
  }

  public async predictImage (image: HTMLImageElement, url: string): Promise<boolean> {
    const start = new Date().getTime()

    const prediction = await this.model.classify(image, 3)
    const { result, className, probability } = this.handlePrediction(prediction, url)

    const end = new Date().getTime()
    this.logger.log(`IMG prediction (${end - start} ms) is ${className} ${probability} for ${url}`)
    // console.log(end - start,url,result,className, probability,'yaskur')

    return result
  }

  private handlePrediction (prediction: predictionType[], url: string): { result: boolean, className: string, probability: number } {
    const [{ className: cn1, probability: pb1 }, { className: cn2, probability: pb2 }, { className: cn3, probability: pb3 }] = prediction

    const result1 = this.FILTER_LIST.has(cn1) && pb1 > (this.firstFilterPercentages.get(cn1) as number)
    const result2 = this.FILTER_LIST.has(cn2) && pb2 > (this.secondFilterPercentages.get(cn2) as number)
    const result3 = this.FILTER_LIST.has(cn3) && pb3 > (this.thirdFilterPercentages.get(cn3) as number)
    // console.log(url, result1, result2, result3, prediction, cn1, 'yaskur')

    if (result1) return ({ result: result1, className: cn1 + ' lv1', probability: pb1 })

    if (result2) return ({ result: result2, className: cn2 + ' lv2', probability: pb2 })
    if (result3) return ({ result: result3, className: cn3 + ' lv3', probability: pb3 })

    let total = 0
    if (this.FILTER_LIST.has(cn1)) {
      total += pb1
    }
    if (this.FILTER_LIST.has(cn2)) {
      total += pb2
    }
    if (this.FILTER_LIST.has(cn3)) {
      total += pb3
    }

    const strictness = this.handleFilterStrictness({
      maxValue: 100,
      minValue: 30
    })
    if (total > strictness) {
      return ({ result: true, className: 'Overall', probability: total })
    }

    return ({ result: false, className: cn1, probability: pb1 })
  }

  public handleFilterStrictness ({ minValue, maxValue }: { minValue: number, maxValue: number }): number {
    const MIN = minValue
    const MAX = maxValue
    const value = this.filterStrictness

    const calc = (value: number): number => {
      if (value <= 1) return MAX
      else if (value >= 100) return MIN
      else {
        const coefficient = 1 - (value / 100)
        return (coefficient * (MAX - MIN)) + MIN
      }
    }

    return Math.round((calc(value) / 100) * 10000) / 10000
  }
}
