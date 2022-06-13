import { Interface } from "readline";
import { RGB } from "./utils";

// inital data from server
export interface InitData {
  players: number;
  id: string;
}

// player data from server
export interface InitPlayer {
  x: number;
  y: number;
  id: string;
  team: number;
  name: string;
  angle: number;
}

export type PointsData = [number, number];

export interface BallData {
  x: number;
  y: number;
  charge: number;
  color: RGB;
  charged: string;
}

export interface MouseData {
  key: boolean;
  mouse: boolean;
  left: boolean;
  right: boolean;
}
