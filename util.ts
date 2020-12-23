import fs from 'fs'
import path from 'path'

export function product(ns: number[]) {
  return ns.reduce((a, b) => a * b, 1)
}

export function gcd(x: number, y: number) {
  x = Math.abs(x)
  y = Math.abs(y)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

export function rotated<T>(a: T[], n: number) {
  return [...a.slice(-n), ...a.slice(0, -n)]
}

export function swap<T>(a: T[], i0: number, i1: number) {
  [a[i1], a[i0]] = [a[i0], a[i1]]
}

export function loadInput(dirname: string) {
  return fs.readFileSync(path.join(dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)![1]
}
