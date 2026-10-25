import { CompassDirection, FiveElement, KuaInfo } from "@/types";

export type Gender = "male" | "female";

interface KuaProfile {
  trigram: string;
  element: FiveElement;
  group: "East" | "West";
  shengChi: CompassDirection;
  tianYi: CompassDirection;
  yanNian: CompassDirection;
  fuWei: CompassDirection;
  hoHai: CompassDirection;
  wuGui: CompassDirection;
  liuSha: CompassDirection;
  jueMing: CompassDirection;
}

const KUA_PROFILES: Record<number, KuaProfile> = {
  1: {
    trigram: "Kan (Water)",
    element: "water",
    group: "East",
    shengChi: "SE",
    tianYi: "E",
    yanNian: "S",
    fuWei: "N",
    hoHai: "W",
    wuGui: "NE",
    liuSha: "NW",
    jueMing: "SW",
  },
  2: {
    trigram: "Kun (Earth)",
    element: "earth",
    group: "West",
    shengChi: "NE",
    tianYi: "W",
    yanNian: "NW",
    fuWei: "SW",
    hoHai: "E",
    wuGui: "SE",
    liuSha: "S",
    jueMing: "N",
  },
  3: {
    trigram: "Zhen (Thunder)",
    element: "wood",
    group: "East",
    shengChi: "S",
    tianYi: "N",
    yanNian: "SE",
    fuWei: "E",
    hoHai: "SW",
    wuGui: "NW",
    liuSha: "NE",
    jueMing: "W",
  },
  4: {
    trigram: "Xun (Wind)",
    element: "wood",
    group: "East",
    shengChi: "N",
    tianYi: "S",
    yanNian: "E",
    fuWei: "SE",
    hoHai: "NW",
    wuGui: "SW",
    liuSha: "W",
    jueMing: "NE",
  },
  6: {
    trigram: "Qian (Heaven)",
    element: "metal",
    group: "West",
    shengChi: "W",
    tianYi: "NE",
    yanNian: "SW",
    fuWei: "NW",
    hoHai: "SE",
    wuGui: "E",
    liuSha: "N",
    jueMing: "S",
  },
  7: {
    trigram: "Dui (Lake)",
    element: "metal",
    group: "West",
    shengChi: "NW",
    tianYi: "SW",
    yanNian: "NE",
    fuWei: "W",
    hoHai: "N",
    wuGui: "S",
    liuSha: "SE",
    jueMing: "E",
  },
  8: {
    trigram: "Gen (Mountain)",
    element: "earth",
    group: "West",
    shengChi: "SW",
    tianYi: "NW",
    yanNian: "W",
    fuWei: "NE",
    hoHai: "S",
    wuGui: "N",
    liuSha: "E",
    jueMing: "SE",
  },
  9: {
    trigram: "Li (Fire)",
    element: "fire",
    group: "East",
    shengChi: "E",
    tianYi: "SE",
    yanNian: "N",
    fuWei: "S",
    hoHai: "NE",
    wuGui: "W",
    liuSha: "SW",
    jueMing: "NW",
  },
};

/**
 * Calculates personal Kua number using the classical Solar Year algorithm.
 * If gender is unspecified, we calculate the standard classical primary Gua.
 */
export function calculateKua(birthYear: number, gender: Gender = "female"): KuaInfo {
  // Sum the last two digits of birth year
  const lastTwoDigits = birthYear % 100;
  let sum = Math.floor(lastTwoDigits / 10) + (lastTwoDigits % 10);
  while (sum > 9) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }

  let kua = 0;
  const isPost2000 = birthYear >= 2000;

  if (gender === "male") {
    if (isPost2000) {
      kua = 9 - sum;
    } else {
      kua = 10 - sum;
    }
    if (kua <= 0) kua += 9;
    // Special rule: Male Kua 5 becomes 2 (Kun)
    if (kua === 5) kua = 2;
  } else {
    // Female
    if (isPost2000) {
      kua = sum + 6;
    } else {
      kua = sum + 5;
    }
    while (kua > 9) {
      kua = Math.floor(kua / 10) + (kua % 10);
    }
    // Special rule: Female Kua 5 becomes 8 (Gen)
    if (kua === 5) kua = 8;
  }

  const profile = KUA_PROFILES[kua] || KUA_PROFILES[1];

  return {
    kuaNumber: kua,
    group: profile.group,
    trigram: profile.trigram,
    element: profile.element,
    luckyDirections: {
      shengChi: profile.shengChi,
      tianYi: profile.tianYi,
      yanNian: profile.yanNian,
      fuWei: profile.fuWei,
    },
    inauspiciousDirections: {
      hoHai: profile.hoHai,
      wuGui: profile.wuGui,
      liuSha: profile.liuSha,
      jueMing: profile.jueMing,
    },
  };
}
