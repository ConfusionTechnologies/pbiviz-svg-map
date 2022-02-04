import { atom } from 'nanostores'
import powerbi from 'powerbi-visuals-api'

import { VisualSettings } from '../settings'

//https://github.com/nanostores/nanostores?ref=bestofvue.com#atoms
//you can use atoms for objects too if only allow replacing the whole object
//if yknow what the concept of an atom is, you will see why making
//an immutable settings object that comes from external an atom is fine

export const vizConfig = atom<VisualSettings>()
export const vizData = atom<powerbi.DataView>()
