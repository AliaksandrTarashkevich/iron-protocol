import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { Sun, Moon, ChevronDown, ChevronRight, Check, Dumbbell, Calendar, TrendingDown, Target, Play, Pause, RotateCcw, Info, Trophy, Flame, ChevronLeft, Clock } from "lucide-react";

const EXERCISE_INFO = {
  "pushup_incline": { short: "Отжимания на упорах, ноги на возвышении", desc: "Поставь упоры на пол, ноги на диван или стул. Тело прямое, без прогиба в пояснице. Опускайся медленно (3 сек вниз), грудью между упоров, взрывной подъём вверх. Чем выше ноги — тем больше нагрузка на верхнюю грудную и передние дельты.", tips: "Если тяжело — начни с обычных отжиманий на упорах (ноги на полу)." },
  "pushup_regular": { short: "Отжимания на упорах", desc: "Классические отжимания на упорах. Руки чуть шире плеч, тело — прямая линия от пяток до макушки. Вниз медленно, вверх мощно.", tips: "Упоры снимают нагрузку с запястий — критично при большом весе." },
  "pushup_diamond": { short: "Алмазные отжимания", desc: "Руки близко друг к другу на упорах. Локти идут вдоль тела, не в стороны. Акцент на трицепс и внутреннюю часть груди.", tips: "Если не выходит — делай обычные с узкой постановкой." },
  "pushup_archer": { short: "Лучник-отжимания", desc: "Широкая постановка рук. Сгибаешь одну руку, другая выпрямляется в сторону. Поочерёдно. Подготовка к отжиманиям на одной руке.", tips: "Рабочая рука делает всю работу, вторая лишь поддерживает." },
  "pushup_explosive": { short: "Взрывные отжимания", desc: "Обычное отжимание, но фаза подъёма — максимально мощная, так чтобы ладони оторвались от пола. Развивает взрывную силу.", tips: "Начни с 3-4 повторений." },
  "pike_pushup": { short: "Пайк-отжимания", desc: "Встань в «горку» — таз вверх, ноги и руки прямые, голова между рук. Сгибай локти, опуская макушку к полу. Имитация жима над головой. Основа подготовки к стойке на руках.", tips: "Чем ближе ноги к рукам — тем тяжелее." },
  "goblet_squat": { short: "Гоблет-приседания", desc: "Одна гантель вертикально за блин, прижата к груди. Ноги на ширине плеч, носки наружу. Приседай до параллели. Гантель у груди — противовес для ровной спины.", tips: "Колени по направлению носков. Пятки на полу." },
  "goblet_squat_pause": { short: "Гоблет-присед с паузой 2с", desc: "Обычный гоблет-присед, но в нижней точке задержись на 2 секунды. Убирает инерцию, заставляет мышцы работать честно.", tips: "Не расслабляйся внизу — держи напряжение." },
  "split_squat": { short: "Болгарские сплит-приседы", desc: "Задняя нога на диване/стуле. Приседай до почти касания коленом пола. Одно из лучших упражнений на квадрицепс и баланс.", tips: "Корпус вертикально. Гантели в руках по бокам." },
  "bent_row": { short: "Тяга гантелей в наклоне", desc: "Наклон ~45°, колени чуть согнуты. Тяни к поясу, сводя лопатки. Спина ровная!", tips: "Не дёргай. Медленно вверх — пауза — медленно вниз." },
  "bent_row_single": { short: "Тяга гантели одной рукой", desc: "Одно колено и рука на опоре, другая рука тянет гантель к поясу. Лучше фокус на каждую сторону спины.", tips: "Лопатку своди к позвоночнику. Не крути корпус." },
  "ohp": { short: "Жим гантелей стоя", desc: "Стоя, гантели на уровне плеч, ладони от себя. Жми вверх до полного выпрямления. Стоя — включает кор.", tips: "Напряги пресс и ягодицы. Не прогибайся в пояснице." },
  "lateral_raise": { short: "Разводка в стороны", desc: "Стоя, руки чуть согнуты. Через стороны до уровня плеч (не выше). Контролируй опускание.", tips: "Контроль важнее веса. Не «кидай» гантели." },
  "lateral_raise_21": { short: "Разводка 21 (7+7+7)", desc: "7 повторений от бедра до середины, 7 от середины до верха, 7 полных. Без отдыха. Экстремальное жжение в дельтах.", tips: "Лёгкий вес! Это гораздо тяжелее, чем кажется." },
  "arnold_press": { short: "Жим Арнольда", desc: "Гантели перед лицом, ладони к себе. Разворачивай ладони по мере жима вверх. Все три пучка дельт в одном движении.", tips: "Медленный разворот — ключ к эффекту." },
  "front_raise": { short: "Подъём перед собой", desc: "Руки с гантелями перед бёдрами. Поднимай прямые руки вперёд до плеч. Передние дельты.", tips: "Не раскачивайся. Если качает — вес легче." },
  "rear_delt_fly": { short: "Разводка в наклоне", desc: "Наклон вперёд, корпус почти параллелен полу. Разводи в стороны, сводя лопатки. Задние дельты — самый отстающий пучок.", tips: "Представь, что раздвигаешь воду." },
  "db_rdl": { short: "Румынская тяга", desc: "Стоя, таз назад, гантели вдоль ног. Колени чуть согнуты (не приседай!). Чувствуй растяжение задней поверхности. Вернись, сжимая ягодицы.", tips: "Спина ровная! Гантели скользят вдоль ног." },
  "single_rdl": { short: "Румынская тяга на одной ноге", desc: "Как обычная, но на одной ноге. Вторая уходит назад. Задняя цепь + баланс.", tips: "Держись за стену, если шатает." },
  "lunges": { short: "Выпады назад", desc: "Шагни назад, колено почти до пола. Безопаснее для коленей, чем вперёд.", tips: "Корпус вертикально. Шаг длинный." },
  "sumo_squat": { short: "Сумо-присед", desc: "Ноги широко, носки 45°. Гантель между ног. Приседай до параллели.", tips: "Колени по носкам. Спина вертикальная." },
  "calf_raise": { short: "Подъём на носки", desc: "С гантелями, пауза 1 сек вверху. Медленно вниз. На порожке — больше амплитуда.", tips: "Полная амплитуда > количество." },
  "calf_raise_single": { short: "Подъём на носки (одна нога)", desc: "Как обычный, но на одной ноге. Гантель в одной руке, второй за стену.", tips: "В 2 раза тяжелее — в 2 раза эффективнее." },
  "jump_squat": { short: "Приседания с выпрыгиванием", desc: "Присядь — мощно выпрыгни. Приземляйся мягко на полусогнутые ноги. Взрывная сила.", tips: "БЕЗ гантелей! Приземление — мягкое!" },
  "db_thruster": { short: "Трастер с гантелями", desc: "Гантели на плечах. Присед → из нижней точки одним движением встань и выжми вверх. Лучшее упражнение «всё тело».", tips: "Один импульс, не два движения." },
  "renegade_row": { short: "Тяга ренегата", desc: "Упор лёжа на гантелях. Тяни одну к поясу, удерживая планку. Поочерёдно. Спина + кор.", tips: "Ноги шире = легче баланс." },
  "jumping_jacks": { short: "Jumping Jacks", desc: "Прыжком ноги в стороны — руки вверх. Если колени — Step Jacks (шаги).", tips: "Держи ритм, дыши." },
  "high_knees": { short: "Бег на месте (колени вверх)", desc: "Колени до пояса. Руки как при беге. Мощное кардио.", tips: "Спина прямая." },
  "mountain_climbers": { short: "Mountain Climbers", desc: "Упор лёжа, поочерёдно колени к груди быстро. Кардио + кор.", tips: "Тело — линия, таз не задирай." },
  "burpees": { short: "Бёрпи", desc: "Присед → упор лёжа → (отжимание) → прыжок к рукам → выпрыгивание. Лучшее для метаболизма.", tips: "Первые недели — без прыжка вверх." },
  "plank": { short: "Планка", desc: "На локтях, тело прямое. Ягодицы и пресс напряжены. Не прогибайся в пояснице!", tips: "20 честных секунд > 60 с прогибом." },
  "plank_shoulder_tap": { short: "Планка + касание плеч", desc: "Высокая планка. Касайся рукой противоположного плеча. Тело не раскачивается.", tips: "Ноги шире — легче." },
  "side_plank": { short: "Боковая планка", desc: "На локте, боком. Тело прямое. Косые мышцы.", tips: "Тяжело — согни нижнее колено." },
  "dead_bug": { short: "Dead Bug", desc: "На спине, руки вверх, ноги 90°. Опускай противоположную руку и ногу. Поясница прижата!", tips: "Медленно. Поясница приклеена." },
  "v_ups": { short: "V-ups (складка)", desc: "На спине, одновременно подними ноги и корпус, тянись к носкам.", tips: "Тяжело — сгибай колени." },
  "leg_raise": { short: "Подъём ног лёжа", desc: "На спине, прямые ноги до 90°, медленно вниз. Поясница прижата.", tips: "Чем медленнее вниз — тем лучше." },
  "hollow_hold": { short: "Hollow Hold", desc: "На спине, руки за головой и ноги на 15-20 см от пола. Поясница вжата. «Лодочка» — база калистеники.", tips: "Начни с согнутыми коленями." },
  "l_sit": { short: "L-sit на упорах", desc: "Между упорами, оттолкнись, выпрями ноги вперёд. Держи. Пресс + плечи.", tips: "Начни с tuck (колени к груди)." },
  "wall_handstand": { short: "Стойка у стены", desc: "Руки на полу, ногами заходи по стене вверх. Сила плеч + баланс.", tips: "Руки на ширине плеч, пальцы растопырены." },
  "wall_hspu_neg": { short: "Негативные отжимания в стойке", desc: "В стойке медленно (5 сек) вниз. Коснулся головой пола — встань с помощью ног. Подготовка к HSPU.", tips: "Контроль спуска даёт силу." },
  "pseudo_planche": { short: "Pseudo Planche Lean", desc: "Упор лёжа, пальцы назад. Наклоняй тело вперёд. Плечи впереди ладоней. Подготовка к планшу.", tips: "Начни с малого наклона." },
  "pistol_assisted": { short: "Пистолетик с опорой", desc: "Присед на одной ноге, вторая вперёд. Держись за стул. Цель — убирать опору.", tips: "Пятка на полу. Колено вперёд над носком." },
  "pullup": { short: "Подтягивания", desc: "Хват на ширине плеч или чуть шире. Тянись грудью к перекладине, сводя лопатки. Опускайся медленно. Если нет полных — делай негативные (запрыгни вверх, медленно опускайся 5 сек).", tips: "Нет турника дома — найди площадку во дворе или купи дверной турник." },
  "pullup_negative": { short: "Негативные подтягивания", desc: "Запрыгни или встань на стул в верхнюю точку (подбородок над перекладиной). Медленно опускайся 5 секунд. Лучший способ научиться подтягиваться.", tips: "3-5 негативных = целый сет работы для спины." },
};

function generatePlan() {
  return [
    { weekNum: 1, phase: "Вход", rounds: 2, restEx: 30, restRound: 120, days: [
      { name: "Плечи + жимы", exercises: [
        { id: "pushup_incline", reps: "8", priority: true },
        { id: "ohp", reps: "10", weight: "11.5 кг", priority: true },
        { id: "lateral_raise", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "10", weight: "11.5 кг" },
        { id: "bent_row", reps: "10", weight: "11.5 кг" },
        { id: "jumping_jacks", reps: "30 сек" },
        { id: "plank", reps: "20 сек" },
      ]},
      { name: "Тяги + своё тело", exercises: [
        { id: "bent_row", reps: "10", weight: "11.5 кг" },
        { id: "pushup_regular", reps: "8" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "lunges", reps: "8+8" },
        { id: "ohp", reps: "8", weight: "11.5 кг", priority: true },
        { id: "mountain_climbers", reps: "30 сек" },
        { id: "dead_bug", reps: "8+8" },
      ]},
      { name: "Кондиция", exercises: [
        { id: "db_thruster", reps: "8", weight: "11.5 кг" },
        { id: "pushup_regular", reps: "8" },
        { id: "bent_row", reps: "10", weight: "11.5 кг" },
        { id: "lateral_raise", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "10", weight: "11.5 кг" },
        { id: "jumping_jacks", reps: "30 сек" },
        { id: "plank", reps: "20 сек" },
      ]},
    ]},
    { weekNum: 2, phase: "Вход", rounds: 2, restEx: 25, restRound: 110, days: [
      { name: "Дельты 360°", exercises: [
        { id: "pushup_incline", reps: "10", priority: true },
        { id: "ohp", reps: "10", weight: "11.5 кг", priority: true },
        { id: "lateral_raise", reps: "12", weight: "5 кг", priority: true },
        { id: "front_raise", reps: "10", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row", reps: "10", weight: "11.5 кг" },
        { id: "plank", reps: "25 сек" },
      ]},
      { name: "Калистеника + тяги", exercises: [
        { id: "pushup_regular", reps: "10" },
        { id: "bent_row", reps: "12", weight: "11.5 кг" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "lunges", reps: "10+10" },
        { id: "ohp", reps: "8", weight: "11.5 кг", priority: true },
        { id: "calf_raise", reps: "15" },
        { id: "side_plank", reps: "20+20 сек" },
      ]},
      { name: "Метаболическая", exercises: [
        { id: "db_thruster", reps: "10", weight: "11.5 кг" },
        { id: "pushup_regular", reps: "10" },
        { id: "bent_row", reps: "10", weight: "11.5 кг" },
        { id: "lateral_raise", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "burpees", reps: "6" },
        { id: "plank", reps: "30 сек" },
      ]},
    ]},
    { weekNum: 3, phase: "Набор", rounds: 3, restEx: 25, restRound: 100, days: [
      { name: "Плечи-приоритет", exercises: [
        { id: "pushup_incline", reps: "10", priority: true },
        { id: "arnold_press", reps: "8", weight: "11.5 кг", priority: true },
        { id: "lateral_raise", reps: "12", weight: "5 кг", priority: true },
        { id: "rear_delt_fly", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row", reps: "12", weight: "11.5 кг" },
        { id: "high_knees", reps: "30 сек" },
        { id: "plank", reps: "30 сек" },
      ]},
      { name: "Подтягивания + своё тело", exercises: [
        { id: "pullup_negative", reps: "5" },
        { id: "pushup_regular", reps: "12" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "split_squat", reps: "8+8" },
        { id: "v_ups", reps: "10" },
        { id: "mountain_climbers", reps: "40 сек" },
        { id: "plank_shoulder_tap", reps: "10+10" },
        { id: "hollow_hold", reps: "15 сек" },
      ]},
      { name: "Мощность", exercises: [
        { id: "db_thruster", reps: "10", weight: "11.5 кг" },
        { id: "pushup_diamond", reps: "6" },
        { id: "lateral_raise", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "renegade_row", reps: "6+6", weight: "11.5 кг" },
        { id: "burpees", reps: "8" },
        { id: "plank", reps: "30 сек" },
      ]},
    ]},
    { weekNum: 4, phase: "Набор", rounds: 3, restEx: 20, restRound: 90, days: [
      { name: "Дельты + пайк", exercises: [
        { id: "pike_pushup", reps: "6", priority: true },
        { id: "pushup_incline", reps: "12", priority: true },
        { id: "arnold_press", reps: "10", weight: "11.5 кг", priority: true },
        { id: "lateral_raise", reps: "15", weight: "5 кг", priority: true },
        { id: "rear_delt_fly", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row", reps: "12", weight: "11.5 кг" },
        { id: "plank", reps: "35 сек" },
      ]},
      { name: "Подтягивания + калистеника", exercises: [
        { id: "pullup_negative", reps: "5", note: "Или полные, если можешь" },
        { id: "pushup_diamond", reps: "8" },
        { id: "split_squat", reps: "10+10" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "jump_squat", reps: "8" },
        { id: "mountain_climbers", reps: "40 сек" },
        { id: "v_ups", reps: "12" },
        { id: "hollow_hold", reps: "20 сек" },
      ]},
      { name: "Взрывная", exercises: [
        { id: "db_thruster", reps: "12", weight: "11.5 кг" },
        { id: "pushup_explosive", reps: "6" },
        { id: "lateral_raise", reps: "15", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "renegade_row", reps: "8+8", weight: "11.5 кг" },
        { id: "burpees", reps: "10" },
        { id: "plank_shoulder_tap", reps: "12+12" },
      ]},
    ]},
    { weekNum: 5, phase: "Интенсив", rounds: 3, restEx: 20, restRound: 90, days: [
      { name: "Вертикальный жим", exercises: [
        { id: "pike_pushup", reps: "8", priority: true },
        { id: "pushup_incline", reps: "12", priority: true },
        { id: "ohp", reps: "12", weight: "11.5 кг", priority: true },
        { id: "lateral_raise", reps: "15", weight: "5 кг", priority: true },
        { id: "rear_delt_fly", reps: "12", weight: "5 кг", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row", reps: "12", weight: "11.5 кг" },
        { id: "leg_raise", reps: "12" },
      ]},
      { name: "Подтягивания + баланс", exercises: [
        { id: "pullup", reps: "3–5", note: "Или негативные ×5" },
        { id: "pushup_archer", reps: "3+3" },
        { id: "split_squat", reps: "10+10" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "single_rdl", reps: "8+8", weight: "11.5 кг" },
        { id: "burpees", reps: "10" },
        { id: "side_plank", reps: "25+25 сек" },
        { id: "hollow_hold", reps: "25 сек" },
      ]},
      { name: "Кардио-сила", exercises: [
        { id: "db_thruster", reps: "12", weight: "11.5 кг" },
        { id: "pushup_explosive", reps: "8" },
        { id: "pike_pushup", reps: "8", priority: true },
        { id: "jump_squat", reps: "10" },
        { id: "renegade_row", reps: "8+8", weight: "11.5 кг" },
        { id: "high_knees", reps: "45 сек" },
        { id: "hollow_hold", reps: "25 сек" },
      ]},
    ]},
    { weekNum: 6, phase: "Интенсив", rounds: 3, restEx: 15, restRound: 75, days: [
      { name: "Плечи-убийца", exercises: [
        { id: "pike_pushup", reps: "10", priority: true },
        { id: "arnold_press", reps: "12", weight: "11.5 кг", priority: true },
        { id: "lateral_raise_21", reps: "21", weight: "5 кг", priority: true },
        { id: "rear_delt_fly", reps: "15", weight: "5 кг", priority: true },
        { id: "wall_handstand", reps: "20 сек", priority: true },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row", reps: "15", weight: "11.5 кг" },
        { id: "plank", reps: "45 сек" },
      ]},
      { name: "Подтягивания + калистеника", exercises: [
        { id: "pullup", reps: "5", note: "Или негативные ×6" },
        { id: "pushup_archer", reps: "5+5" },
        { id: "split_squat", reps: "12+12" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "jump_squat", reps: "10" },
        { id: "l_sit", reps: "10 сек" },
        { id: "hollow_hold", reps: "30 сек" },
        { id: "burpees", reps: "12" },
      ]},
      { name: "Метакон", exercises: [
        { id: "db_thruster", reps: "15", weight: "11.5 кг" },
        { id: "pushup_explosive", reps: "10" },
        { id: "pike_pushup", reps: "10", priority: true },
        { id: "jump_squat", reps: "12" },
        { id: "renegade_row", reps: "10+10", weight: "11.5 кг" },
        { id: "high_knees", reps: "50 сек" },
        { id: "pseudo_planche", reps: "15 сек" },
      ]},
    ]},
    { weekNum: 7, phase: "Калистеника", rounds: 3, restEx: 15, restRound: 75, days: [
      { name: "Калистеника: плечи", exercises: [
        { id: "pike_pushup", reps: "10", priority: true, note: "Ноги на возвышении" },
        { id: "wall_handstand", reps: "30 сек", priority: true },
        { id: "pushup_archer", reps: "5+5" },
        { id: "lateral_raise", reps: "15", weight: "5 кг", priority: true, note: "Пауза 2 сек вверху" },
        { id: "pseudo_planche", reps: "15 сек" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row_single", reps: "10+10", weight: "11.5 кг" },
        { id: "hollow_hold", reps: "30 сек" },
      ]},
      { name: "Подтягивания + пистолетик", exercises: [
        { id: "pullup", reps: "5–8" },
        { id: "pistol_assisted", reps: "3+3" },
        { id: "pushup_diamond", reps: "10" },
        { id: "split_squat", reps: "12+12" },
        { id: "jump_squat", reps: "12" },
        { id: "l_sit", reps: "15 сек" },
        { id: "side_plank", reps: "30+30 сек" },
        { id: "burpees", reps: "14" },
      ]},
      { name: "Максимум", exercises: [
        { id: "pushup_explosive", reps: "10" },
        { id: "pike_pushup", reps: "10", priority: true },
        { id: "db_thruster", reps: "15", weight: "11.5 кг" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "renegade_row", reps: "10+10", weight: "11.5 кг" },
        { id: "high_knees", reps: "60 сек" },
        { id: "pseudo_planche", reps: "20 сек" },
      ]},
    ]},
    { weekNum: 8, phase: "Калистеника", rounds: 3, restEx: 15, restRound: 60, days: [
      { name: "Калистеника: финал", exercises: [
        { id: "pike_pushup", reps: "12", priority: true, note: "Ноги высоко" },
        { id: "wall_hspu_neg", reps: "3–5", priority: true },
        { id: "pushup_archer", reps: "6+6" },
        { id: "lateral_raise_21", reps: "21", weight: "5 кг", priority: true },
        { id: "pseudo_planche", reps: "20 сек" },
        { id: "goblet_squat", reps: "12", weight: "11.5 кг" },
        { id: "bent_row_single", reps: "12+12", weight: "11.5 кг" },
        { id: "hollow_hold", reps: "35 сек" },
      ]},
      { name: "Подтягивания + пистолетик", exercises: [
        { id: "pullup", reps: "8–10" },
        { id: "pistol_assisted", reps: "5+5" },
        { id: "pushup_incline", reps: "15", priority: true },
        { id: "split_squat", reps: "12+12" },
        { id: "jump_squat", reps: "15" },
        { id: "l_sit", reps: "20 сек" },
        { id: "hollow_hold", reps: "30 сек" },
        { id: "burpees", reps: "12" },
      ]},
      { name: "ФИНАЛЬНЫЙ ТЕСТ", exercises: [
        { id: "pushup_regular", reps: "МАКС" },
        { id: "pike_pushup", reps: "МАКС", priority: true },
        { id: "pullup", reps: "МАКС" },
        { id: "db_thruster", reps: "15", weight: "11.5 кг" },
        { id: "burpees", reps: "2 мин" },
        { id: "wall_handstand", reps: "МАКС сек", priority: true },
        { id: "hollow_hold", reps: "МАКС сек" },
      ]},
    ]},
  ];
}
const PLAN = generatePlan();
const PC = { "Вход": "#22c55e", "Набор": "#eab308", "Интенсив": "#f97316", "Калистеника": "#8b5cf6" };

const T = {
  dark: { bg: "#09090b", sf: "#18181b", sf2: "#27272a", sf3: "#3f3f46", bd: "#3f3f46", tx: "#fafafa", tm: "#a1a1aa", ts: "#71717a", ac: "#6366f1", gr: "#22c55e", grs: "rgba(34,197,94,0.1)", rd: "#ef4444", sh: "0 1px 3px rgba(0,0,0,0.4)" },
  light: { bg: "#fafafa", sf: "#ffffff", sf2: "#f4f4f5", sf3: "#e4e4e7", bd: "#e4e4e7", tx: "#18181b", tm: "#71717a", ts: "#a1a1aa", ac: "#6366f1", gr: "#16a34a", grs: "rgba(22,163,74,0.07)", rd: "#dc2626", sh: "0 1px 3px rgba(0,0,0,0.06)" },
};

const Ctx = createContext(T.dark);

function Card({ children, style }) {
  const t = useContext(Ctx);
  return <div style={{ background: t.sf, border: `1px solid ${t.bd}`, borderRadius: 12, padding: 16, boxShadow: t.sh, ...style }}>{children}</div>;
}

function Badge({ children, color }) {
  return <span style={{ display: "inline-flex", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: `${color}20`, color }}>{children}</span>;
}

function RTimer({ seconds, label, onDone }) {
  const t = useContext(Ctx);
  const [left, setLeft] = useState(seconds);
  const [run, setRun] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (run && left > 0) ref.current = setInterval(() => setLeft(l => l - 1), 1000);
    else if (left === 0 && run) { setRun(false); try { const c = new (window.AudioContext || window.webkitAudioContext)(); const o = c.createOscillator(); const g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.3; o.start(); o.stop(c.currentTime + 0.15); } catch {} onDone?.(); }
    return () => clearInterval(ref.current);
  }, [run, left]);
  const p = ((seconds - left) / seconds) * 100;
  return (
    <div style={{ background: t.sf2, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
      <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
        <svg viewBox="0 0 40 40" style={{ transform: "rotate(-90deg)" }}><circle cx="20" cy="20" r="17" fill="none" stroke={t.bd} strokeWidth="3" /><circle cx="20" cy="20" r="17" fill="none" stroke={left === 0 ? t.gr : t.ac} strokeWidth="3" strokeDasharray={106.8} strokeDashoffset={106.8*(1-p/100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.3s" }} /></svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.tx }}>{left}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: t.tm }}>{label}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <button onClick={() => setRun(!run)} style={{ background: run ? t.rd : t.ac, color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>{run ? <Pause size={12} /> : <Play size={12} />}{run ? "Пауза" : "Старт"}</button>
          <button onClick={() => { setRun(false); setLeft(seconds); }} style={{ background: t.sf3, color: t.tm, border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}><RotateCcw size={12} /></button>
        </div>
      </div>
    </div>
  );
}

function ExRow({ ex, done, onToggle, open, onOpen }) {
  const t = useContext(Ctx);
  const info = EXERCISE_INFO[ex.id] || {};
  return (
    <div style={{ background: done ? t.grs : t.sf, border: `1px solid ${done ? `${t.gr}33` : t.bd}`, borderRadius: 10, overflow: "hidden", opacity: done ? 0.6 : 1, transition: "all 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }} onClick={onToggle}>
        <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? t.gr : t.bd}`, background: done ? t.gr : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{done && <Check size={14} color="#fff" strokeWidth={3} />}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: ex.priority ? 600 : 500, color: ex.priority && !done ? t.ac : t.tx, textDecoration: done ? "line-through" : "none" }}>{ex.priority ? "🎯 " : ""}{info.short || ex.id}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {ex.weight && <span style={{ fontSize: 10, color: t.ts, background: t.sf2, padding: "1px 6px", borderRadius: 4 }}>{ex.weight}</span>}
          <span style={{ fontSize: 13, fontWeight: 700, color: done ? t.gr : t.ac }}>{done ? "✓" : ex.reps}</span>
          <button onClick={e => { e.stopPropagation(); onOpen(); }} style={{ background: "none", border: "none", cursor: "pointer", color: t.tm, padding: 2, display: "flex" }}>{open ? <ChevronDown size={16} /> : <Info size={16} />}</button>
        </div>
      </div>
      {open && info.desc && (
        <div style={{ padding: "0 12px 12px 44px", fontSize: 12, lineHeight: 1.5, color: t.tm }}>
          <p style={{ margin: "0 0 6px" }}>{info.desc}</p>
          {(ex.note || info.tips) && <div style={{ background: `${t.ac}10`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: t.ac }}>💡 {ex.note || info.tips}</div>}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState(() => { try { return localStorage.getItem("wt_th") || "dark"; } catch { return "dark"; } });
  const t = T[mode];
  const [tab, setTab] = useState("workout");
  const [cw, setCw] = useState(() => { try { return JSON.parse(localStorage.getItem("wt_w")) || 0; } catch { return 0; } });
  const [done, setDone] = useState(() => { try { return JSON.parse(localStorage.getItem("wt_d")) || {}; } catch { return {}; } });
  const [wlog, setWlog] = useState(() => { try { return JSON.parse(localStorage.getItem("wt_wl")) || []; } catch { return []; } });
  const [chk, setChk] = useState({});
  const [exp, setExp] = useState(null);
  const [ar, setAr] = useState(0);
  const [sr, setSr] = useState(false);
  const [wi, setWi] = useState("");
  const [vw, setVw] = useState(0);
  const [cm, setCm] = useState(0);
  const [weightSaved, setWeightSaved] = useState(false);

  useEffect(() => { try { localStorage.setItem("wt_th", mode); } catch {} }, [mode]);
  useEffect(() => { try { localStorage.setItem("wt_w", JSON.stringify(cw)); } catch {} }, [cw]);
  useEffect(() => { try { localStorage.setItem("wt_d", JSON.stringify(done)); } catch {} }, [done]);
  useEffect(() => { try { localStorage.setItem("wt_wl", JSON.stringify(wlog)); } catch {} }, [wlog]);

  const week = PLAN[cw];
  const dc = Object.values(done).filter(c => c.week === cw).length;
  const wi2 = Math.min(dc, 2);
  const wo = week.days[wi2];
  const ds = new Date().toISOString().slice(0, 10);
  const tk = `${ds}_w${cw}_d${wi2}`;
  const td = tk in done;
  const ic = (r, i) => !!chk[`${r}_${i}`];
  const tc = (r, i) => setChk(p => ({ ...p, [`${r}_${i}`]: !p[`${r}_${i}`] }));
  const rd = (r) => wo.exercises.every((_, i) => ic(r, i));
  const ad = Array.from({ length: week.rounds }, (_, r) => rd(r)).every(Boolean);
  const [showCelebration, setShowCelebration] = useState(false);
  const mc = () => { setDone(p => ({ ...p, [tk]: { week: cw, day: wi2, name: wo.name, date: ds, rounds: week.rounds, exercises: wo.exercises.map(e => ({ id: e.id, reps: e.reps })) } })); setChk({}); setAr(0); setShowCelebration(true); setTimeout(() => { setShowCelebration(false); setTab("calendar"); }, 2500); };
  const aw = () => { const w = parseFloat(wi); if (!w || w < 30 || w > 300) return; const existed = wlog.some(e => e.date === ds); setWlog(p => [...p.filter(e => e.date !== ds), { date: ds, weight: w }].sort((a, b) => a.date.localeCompare(b.date))); setWi(""); setWeightSaved(true); setTimeout(() => setWeightSaved(false), 2000); };
  const cd = getCalendarMonth(cm);
  const cY = cd.getFullYear(), cM = cd.getMonth();
  const mN = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
  const fD = (new Date(cY, cM, 1).getDay() + 6) % 7;
  const dM = new Date(cY, cM + 1, 0).getDate();
  const cDates = Object.values(done).map(c => c.date);

  function getCalendarMonth(o) { const n = new Date(); return new Date(n.getFullYear(), n.getMonth() + o, 1); }

  const tabs = [
    { id: "workout", icon: <Dumbbell size={20} />, label: "Старт" },
    { id: "program", icon: <Target size={20} />, label: "План" },
    { id: "calendar", icon: <Calendar size={20} />, label: "Календарь" },
    { id: "weight", icon: <TrendingDown size={20} />, label: "Прогресс" },
  ];

  return (
    <Ctx.Provider value={t}>
      <div style={{ minHeight: "100vh", background: t.bg, color: t.tx, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        {showCelebration && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <style>{`
              @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
              @keyframes celebration-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); } }
              .confetti-piece { position: absolute; top: -20px; width: 10px; height: 10px; border-radius: 2px; animation: confetti-fall 2.5s ease-in forwards; }
            `}</style>
            {Array.from({ length: 40 }, (_, i) => {
              const colors = ["#22c55e", "#6366f1", "#eab308", "#f97316", "#ec4899", "#8b5cf6", "#06b6d4"];
              return <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%`, backgroundColor: colors[i % colors.length], animationDelay: `${Math.random() * 0.8}s`, animationDuration: `${1.5 + Math.random() * 1.5}s`, width: 6 + Math.random() * 8, height: 6 + Math.random() * 8, borderRadius: Math.random() > 0.5 ? "50%" : "2px" }} />;
            })}
            <div style={{ background: t.sf, borderRadius: 20, padding: "32px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", textAlign: "center", animation: "celebration-pulse 0.6s ease", zIndex: 201 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.gr }}>ОТЛИЧНАЯ РАБОТА!</div>
              <div style={{ fontSize: 13, color: t.tm, marginTop: 4 }}>Тренировка записана</div>
            </div>
          </div>
        )}
        <div style={{ padding: "14px 16px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Flame size={22} color={t.ac} /><span>IRON<span style={{ color: t.tm, fontWeight: 400 }}>PROTOCOL</span></span>
            </h1>
            <div style={{ fontSize: 11, color: t.tm, marginTop: 2, marginLeft: 30 }}>
              {(() => { const hw = tab === "program" ? PLAN[vw] : week; const hwn = tab === "program" ? vw : cw; return <>Нед. {hwn + 1}/8 · <span style={{ color: PC[hw.phase] }}>{hw.phase}</span> · {hw.rounds} кр · {hw.restEx}с/{hw.restRound}с</>; })()}
            </div>
          </div>
          <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ background: t.sf2, border: `1px solid ${t.bd}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.tx }}>
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div style={{ padding: "4px 16px 8px", display: "flex", gap: 3 }}>
          {PLAN.map((w, i) => {
            const isViewing = tab === "program" && i === vw;
            return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < cw ? PC[w.phase] : i === cw ? t.ac : isViewing ? `${PC[w.phase]}88` : t.sf3, opacity: i < cw ? 0.5 : 1, transition: "all 0.3s" }} />;
          })}
        </div>

        <div style={{ padding: "4px 16px 0" }}>
          {tab === "workout" && (
            <div>
              <Card style={{ marginBottom: 12, background: `${PC[week.phase]}10`, borderColor: `${PC[week.phase]}33` }}>
                <div style={{ fontSize: 11, color: t.tm, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Сегодня · Тренировка {wi2 + 1}/3</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{wo.name}</div>
                {td && <Badge color={t.gr}>✅ Выполнено</Badge>}
                {dc >= 3 && !td && <div style={{ fontSize: 12, color: t.ac, marginTop: 6 }}>Все 3 тренировки готовы — переключай неделю в «План» 🎉</div>}
              </Card>

              {!td && Array.from({ length: week.rounds }, (_, ri) => (
                <div key={ri} style={{ marginBottom: 12 }}>
                  <button onClick={() => setAr(ar === ri ? -1 : ri)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 0", color: t.tx }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: rd(ri) ? t.gr : ri === ar ? t.ac : t.sf3, color: "#fff" }}>
                      {rd(ri) ? <Check size={14} /> : ri + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Круг {ri + 1}</span>
                    {ar === ri ? <ChevronDown size={16} color={t.tm} /> : <ChevronRight size={16} color={t.tm} />}
                  </button>
                  {ar === ri && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                      {wo.exercises.map((ex, ei) => (
                        <ExRow key={ei} ex={ex} done={ic(ri, ei)} onToggle={() => tc(ri, ei)}
                          open={exp === `${ri}_${ei}`} onOpen={() => setExp(exp === `${ri}_${ei}` ? null : `${ri}_${ei}`)} />
                      ))}
                      {rd(ri) && ri < week.rounds - 1 && <RTimer seconds={week.restRound} label={`Отдых → круг ${ri + 2}`} onDone={() => setAr(ri + 1)} />}
                    </div>
                  )}
                </div>
              ))}

              {!td && (
                <button onClick={() => setSr(!sr)} style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${t.bd}`, background: t.sf, color: t.tm, fontSize: 12, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Clock size={14} /> Таймер отдыха ({week.restEx}с)
                </button>
              )}
              {sr && <RTimer seconds={week.restEx} label="Отдых между упражнениями" />}

              {ad && !td && (
                <button onClick={mc} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", marginTop: 8, background: `linear-gradient(135deg, ${t.gr}, #16a34a)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${t.gr}44`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Trophy size={20} /> ЗАВЕРШЕНА
                </button>
              )}
            </div>
          )}

          {tab === "program" && (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
                {PLAN.map((w, i) => (
                  <button key={i} onClick={() => setVw(i)} style={{ padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${i === vw ? PC[w.phase] : t.bd}`, background: i === vw ? `${PC[w.phase]}15` : t.sf, color: i === vw ? PC[w.phase] : t.tm, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{w.weekNum}</button>
                ))}
              </div>
              {(() => {
                const v = PLAN[vw];
                return (<div>
                  <Card style={{ marginBottom: 10, borderColor: `${PC[v.phase]}33` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontSize: 16, fontWeight: 700 }}>Неделя {v.weekNum}</div><div style={{ fontSize: 12, color: t.tm }}>{v.rounds} кр · {v.restEx}с/{v.restRound}с</div></div>
                      <Badge color={PC[v.phase]}>{v.phase}</Badge>
                    </div>
                    {vw === cw && <div style={{ fontSize: 11, color: t.ac, marginTop: 6 }}>← Текущая</div>}
                  </Card>
                  {v.days.map((d, di) => (
                    <Card key={di} style={{ marginBottom: 8, padding: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>#{di + 1}: {d.name}</div>
                      {d.exercises.map((ex, ei) => (
                        <div key={ei} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: ei < d.exercises.length - 1 ? `1px solid ${t.bd}` : "none", fontSize: 12 }}>
                          <span style={{ color: ex.priority ? t.ac : t.tx }}>{ex.priority ? "🎯 " : ""}{EXERCISE_INFO[ex.id]?.short || ex.id}</span>
                          <span style={{ color: t.tm, whiteSpace: "nowrap", marginLeft: 8 }}>{ex.reps}{ex.weight ? ` · ${ex.weight}` : ""}</span>
                        </div>
                      ))}
                    </Card>
                  ))}
                </div>);
              })()}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => vw > 0 && setVw(vw - 1)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${t.bd}`, background: t.sf, color: t.tm, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>← Пред.</button>
                <button onClick={() => vw < 7 && setVw(vw + 1)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: t.ac, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>След. →</button>
              </div>
              {vw !== cw && (
                <button onClick={() => setCw(vw)} style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 10, border: `2px solid ${t.ac}`, background: `${t.ac}15`, color: t.ac, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                  Переключиться на неделю {vw + 1}
                </button>
              )}
            </div>
          )}

          {tab === "calendar" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <button onClick={() => setCm(cm - 1)} style={{ background: t.sf2, border: "none", color: t.tx, padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><ChevronLeft size={18} /></button>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{mN[cM]} {cY}</span>
                <button onClick={() => setCm(cm + 1)} style={{ background: t.sf2, border: "none", color: t.tx, padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><ChevronRight size={18} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 6 }}>
                {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: t.ts, padding: 4 }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                {Array.from({ length: fD }, (_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: dM }, (_, i) => {
                  const day = i + 1;
                  const s = `${cY}-${String(cM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const isT = s === ds, has = cDates.includes(s);
                  return <div key={day} style={{ textAlign: "center", padding: "8px 0", borderRadius: 8, fontSize: 12, background: has ? t.grs : isT ? t.sf2 : "transparent", border: isT ? `1.5px solid ${t.ac}` : "1.5px solid transparent", color: has ? t.gr : t.tx, fontWeight: has || isT ? 700 : 400 }}>{day}{has && <div style={{ fontSize: 7, marginTop: 1 }}>💪</div>}</div>;
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
                <Card style={{ textAlign: "center", padding: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: t.gr }}>{Object.keys(done).length}</div><div style={{ fontSize: 11, color: t.tm }}>Тренировок</div></Card>
                <Card style={{ textAlign: "center", padding: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: t.ac }}>{cw + 1}</div><div style={{ fontSize: 11, color: t.tm }}>Неделя</div></Card>
              </div>
              {Object.keys(done).length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 12, fontWeight: 600, color: t.tm, marginBottom: 6 }}>Последние</div>{Object.entries(done).sort((a,b)=>b[1].date.localeCompare(a[1].date)).slice(0,5).map(([k,w])=><div key={k} style={{ background: t.sf, borderRadius: 8, padding: "6px 10px", marginBottom: 3, fontSize: 12, display: "flex", justifyContent: "space-between", border: `1px solid ${t.bd}` }}><span>{w.date}</span><span style={{ color: t.tm }}>{w.name}</span></div>)}</div>}
            </div>
          )}

          {tab === "weight" && (
            <div>
              <Card style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Записать вес</div>
                  {wlog.find(e => e.date === ds) && <span style={{ fontSize: 11, color: t.gr }}>Сегодня: {wlog.find(e => e.date === ds).weight} кг</span>}
                </div>
                <div style={{ fontSize: 11, color: t.tm, marginBottom: 8 }}>Одна запись в день — повторный ввод обновит значение</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" placeholder="кг" value={wi} onChange={e => setWi(e.target.value)} onKeyDown={e => e.key === "Enter" && aw()} style={{ flex: 1, background: t.sf2, border: `1px solid ${t.bd}`, borderRadius: 8, padding: "10px 12px", color: t.tx, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit" }} />
                  <button onClick={aw} style={{ background: t.ac, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+</button>
                </div>
                {weightSaved && <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: t.gr, fontWeight: 600, animation: "celebration-pulse 0.4s ease" }}>✅ Вес записан!</div>}
              </Card>
              {wlog.length > 0 && <Card style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>📉 Вес тела</div>
                {(() => {
                  const data = wlog.slice(-30);
                  if (data.length < 2) return <div style={{ textAlign: "center", fontSize: 12, color: t.tm, padding: 16 }}>{data[0].weight} кг — добавь ещё запись для графика</div>;
                  const W = 320, H = 120, PX = 32, PY = 16;
                  const mn = Math.min(...data.map(e => e.weight)) - 1;
                  const mx = Math.max(...data.map(e => e.weight)) + 1;
                  const rg = mx - mn || 1;
                  const pts = data.map((e, i) => ({
                    x: PX + (i / (data.length - 1)) * (W - PX * 2),
                    y: PY + (1 - (e.weight - mn) / rg) * (H - PY * 2),
                    w: e.weight, d: e.date,
                  }));
                  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                  const area = `${line} L${pts[pts.length-1].x},${H - PY} L${pts[0].x},${H - PY} Z`;
                  const gridLines = Array.from({ length: 4 }, (_, i) => mn + (rg / 3) * i);
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
                      <defs>
                        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={t.ac} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={t.ac} stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {gridLines.map((v, i) => {
                        const y = PY + (1 - (v - mn) / rg) * (H - PY * 2);
                        return <g key={i}><line x1={PX} y1={y} x2={W - PX} y2={y} stroke={t.bd} strokeWidth="0.5" /><text x={PX - 4} y={y + 3} textAnchor="end" fontSize="7" fill={t.ts}>{v.toFixed(0)}</text></g>;
                      })}
                      <path d={area} fill="url(#wg)" />
                      <path d={line} fill="none" stroke={t.ac} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      {pts.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5} fill={i === pts.length - 1 ? t.ac : t.sf} stroke={t.ac} strokeWidth={i === pts.length - 1 ? 2 : 1} />
                          {(i === 0 || i === pts.length - 1) && <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8" fontWeight="700" fill={t.tx}>{p.w}</text>}
                        </g>
                      ))}
                      {data.length <= 10 && pts.map((p, i) => (
                        <text key={`d${i}`} x={p.x} y={H - 3} textAnchor="middle" fontSize="6" fill={t.ts}>{p.d.slice(5)}</text>
                      ))}
                    </svg>
                  );
                })()}
                {wlog.length >= 2 && (() => { const d = wlog[wlog.length-1].weight - wlog[0].weight; return <div style={{ textAlign: "center", marginTop: 4, fontSize: 13, fontWeight: 700, color: d <= 0 ? t.gr : t.rd }}>{d > 0 ? "+" : ""}{d.toFixed(1)} кг с начала</div>; })()}
              </Card>}

              {wlog.length > 0 && <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.tm, marginBottom: 6 }}>Записи веса</div>
                {[...wlog].reverse().slice(0, 10).map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: i % 2 === 0 ? t.sf : "transparent", borderRadius: 6, fontSize: 12 }}><span style={{ color: t.tm }}>{e.date}</span><span style={{ fontWeight: 700 }}>{e.weight} кг</span></div>)}
              </div>}

              {/* Strength Progress - works even without exercises field by reading from plan */}
              {(() => {
                const workouts = Object.values(done).sort((a, b) => a.date.localeCompare(b.date));
                if (workouts.length < 2) return (
                  <Card style={{ marginTop: 12, textAlign: "center", padding: 24 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Графики силы</div>
                    <div style={{ fontSize: 12, color: t.tm, lineHeight: 1.5 }}>
                      После 2+ тренировок здесь появятся графики прогресса: отжимания, жим, подтягивания, планка и другие
                    </div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                      {["💪 Отжимания", "🎯 Пайк", "🏋️ Жим", "🔝 Подтяг.", "🦵 Присед", "🧘 Планка"].map(l => (
                        <span key={l} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: t.sf2, color: t.ts }}>{l}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 40, opacity: 0.25 }}>
                      {[20, 35, 30, 45, 40, 55, 50, 65, 60, 75, 70, 80].map((h, i) => (
                        <div key={i} style={{ width: 12, height: `${h}%`, borderRadius: "2px 2px 0 0", background: t.ac }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: t.ts, marginTop: 8 }}>Заверши 2 тренировки на «Старт» →</div>
                  </Card>
                );
                const KEY_EX = [
                  { id: "pushup_regular", label: "Отжимания", icon: "💪" },
                  { id: "pushup_incline", label: "Отжимания (выше)", icon: "⬆️" },
                  { id: "pike_pushup", label: "Пайк-отжимания", icon: "🎯" },
                  { id: "ohp", label: "Жим стоя", icon: "🏋️" },
                  { id: "pullup", label: "Подтягивания", icon: "🔝" },
                  { id: "pullup_negative", label: "Негатив. подтяг.", icon: "🔝" },
                  { id: "goblet_squat", label: "Гоблет-присед", icon: "🦵" },
                  { id: "plank", label: "Планка", icon: "🧘" },
                  { id: "hollow_hold", label: "Hollow Hold", icon: "🌊" },
                ];
                const history = {};
                KEY_EX.forEach(ke => {
                  const pts = [];
                  workouts.forEach(w => {
                    let exList = w.exercises;
                    if (!exList && w.week != null && w.day != null) {
                      const pw = PLAN[w.week];
                      if (pw && pw.days[w.day]) exList = pw.days[w.day].exercises;
                    }
                    if (exList) {
                      const found = exList.find(e => e.id === ke.id);
                      if (found) {
                        const num = parseInt(found.reps) || 0;
                        if (num > 0) pts.push({ date: w.date, val: num, week: (w.week || 0) + 1 });
                      }
                    }
                  });
                  if (pts.length >= 1) history[ke.id] = pts;
                });
                const entries = KEY_EX.filter(ke => history[ke.id]);
                if (entries.length === 0) return null;
                return (
                  <Card style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>📈 Прогресс силы</div>
                    {entries.map(ke => {
                      const pts = history[ke.id];
                      const first = pts[0].val, last = pts[pts.length - 1].val;
                      const diff = last - first;
                      const mn = Math.min(...pts.map(p => p.val)) - 1;
                      const mx = Math.max(...pts.map(p => p.val)) + 1;
                      const rg = mx - mn || 1;
                      return (
                        <div key={ke.id} style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{ke.icon} {ke.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: diff > 0 ? t.gr : diff < 0 ? t.rd : t.tm }}>
                              {pts.length === 1 ? `${last} повт.` : `${first} → ${last}${diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : ""}`}
                            </span>
                          </div>
                          <div style={{ height: 28, display: "flex", alignItems: "flex-end", gap: 2 }}>
                            {pts.slice(-12).map((p, i, arr) => (
                              <div key={i} title={`Нед.${p.week}: ${p.val}`} style={{ flex: 1, borderRadius: "2px 2px 0 0", height: `${Math.max(((p.val - mn) / rg) * 24 + 4, 4)}px`, background: i === arr.length - 1 ? t.ac : `${t.ac}55`, minHeight: 4, transition: "height 0.3s" }} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </Card>
                );
              })()}

              {!wlog.length && Object.keys(done).length === 0 && <div style={{ textAlign: "center", padding: 40, color: t.tm, fontSize: 13 }}>Запиши свой вес ☝️<br /><span style={{ fontSize: 11 }}>Каждый день, утром, после туалета</span></div>}
            </div>
          )}
        </div>

        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: t.sf, borderTop: `1px solid ${t.bd}`, display: "flex", padding: "4px 0 env(safe-area-inset-bottom, 6px)", zIndex: 100 }}>
          {tabs.map(ti => <button key={ti.id} onClick={() => setTab(ti.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0", background: "none", border: "none", cursor: "pointer", color: tab === ti.id ? t.ac : t.ts, fontSize: 10, fontWeight: tab === ti.id ? 600 : 400, fontFamily: "inherit" }}>{ti.icon}<span style={{ marginTop: 2 }}>{ti.label}</span></button>)}
        </div>
      </div>
    </Ctx.Provider>
  );
}
