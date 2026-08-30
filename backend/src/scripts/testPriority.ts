import {
  getBasePriority,
  calculateEffectivePriority
} from "../services/priorityService";

const now = new Date("2026-08-31T12:00:00Z");

const normalPriority = getBasePriority("NORMAL");
const expressPriority = getBasePriority("EXPRESS");

console.log("Normal:", normalPriority);
console.log("Express:", expressPriority);

console.log(
  "Normal after 0 min:",
  calculateEffectivePriority(
    normalPriority,
    new Date("2026-08-31T12:00:00Z"),
    now
  )
);

console.log(
  "Normal after 5 min:",
  calculateEffectivePriority(
    normalPriority,
    new Date("2026-08-31T11:55:00Z"),
    now
  )
);

console.log(
  "Express after 0 min:",
  calculateEffectivePriority(
    expressPriority,
    new Date("2026-08-31T12:00:00Z"),
    now
  )
);

console.log(
  "Express after 2 min:",
  calculateEffectivePriority(
    expressPriority,
    new Date("2026-08-31T11:58:00Z"),
    now
  )
);
