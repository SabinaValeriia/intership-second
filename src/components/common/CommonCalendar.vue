<template lang="pug">
div
  .calendar
    .header
      h2 {{ formattedCurrentMonth }} {{ selectedYear }}
        i.icon.arrow.header-arrow(@click="showYear = !showYear")
      .block
        button.prev(@click.prevent="prevMonth")
          i.icon.arrow
        button.next(@click.prevent="nextMonth")
          i.icon.arrow
    .year-dropdown(v-if="showYear")
      div(@change="changeYear")
        p(
          v-for="year in getYearRange()",
          :key="year",
          :value="year",
          :class="{ today: isCurrentYear(year), selected: year === selectedYear }",
          @click="selectYear(year)"
        ) {{ year }}
    .calendar--block(v-if="!showYear")
      .days
        .day(v-for="day in daysOfWeek", :key="day") {{ day }}
      .weeks
      .weeks
        .week(v-for="week in weeks", :key="week")
          .week-days(
            v-for="day in week",
            :key="day.date",
            :class="{ today: isToday(day.date), 'before-current-day': isBeforeCurrentDay(day.date), next: isNextMonth(day.date) }",
            @click="selectDate(day.date)"
          )
            .week-day(
              :class="{ selected: isSelectedDay(day.date.date()) }",
              @click="selectDay(day.date.date())"
            ) {{ formatDate(day.date) }}
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";

const emit = defineEmits(["date"]);
const currentMonth = ref(dayjs());
const selectedDate = ref("Placeholder");
const selectedStartDate = ref(null);
const startDate = ref("XX/XX/XXXX");
const showYear = ref(false);
const selectedYear = ref(dayjs().year());
const selectedDay = ref(null);
const weeks = computed(() => {
  const firstDayOfMonth = currentMonth.value.startOf("month");
  const startOfMonth = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();

  const previousMonth = currentMonth.value.subtract(1, "month");
  const daysInPreviousMonth = previousMonth.daysInMonth();

  const nextMonth = currentMonth.value.add(1, "month");
  const daysInNextMonth = nextMonth.daysInMonth();

  const weeks = [];
  let currentWeek = [];

  for (let i = startOfMonth - 1; i >= 0; i--) {
    currentWeek.unshift({ date: previousMonth.date(daysInPreviousMonth - i) });
  }

  Array.from({ length: daysInMonth }, (_, i) => {
    currentWeek.push({ date: firstDayOfMonth.date(i + 1) });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  Array.from({ length: 7 - currentWeek.length }, (_, i) => {
    currentWeek.push({ date: nextMonth.date(i + 1) });
  });

  weeks.push(currentWeek);

  return weeks;
});

const isSelectedDay = (day) => day === selectedDay.value;
const selectDay = (day) => {
  selectedDay.value = day;
};

const selectDate = (date: object) => {
  const formattedDate = date.format("DD.MM.YYYY");
  emit("date", formattedDate);
  startDate.value = date;
  selectedStartDate.value = formattedDate;

  selectedDate.value = formattedDate;
  selectedDay.value = date.date();
};

const getYearRange = () => {
  const startYear =
    currentMonth.value.year() - (currentMonth.value.year() % 100) + 1;
  const endYear = startYear + 99;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
};

const selectYear = (year: number) => {
  selectedYear.value = year;
  currentMonth.value = dayjs().year(year);
  showYear.value = false;
};

const isCurrentYear = (year: number) => year === currentMonth.value.year();

const changeYear = () => {
  currentMonth.value = currentMonth.value.year(selectedYear.value);
};

const daysOfWeek = computed(() => ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);

const formattedCurrentMonth = computed(() => currentMonth.value.format("MMMM"));

const formatDate = (date: object) => (date ? date.format("D") : "");

const isToday = (date: object) => date && date.isSame(dayjs(), "day");

const isBeforeCurrentDay = (date: object) =>
  date.isBefore(currentMonth.value.startOf("month"), "day");
const isNextMonth = (date: object) => {
  const nextMonth = currentMonth.value.add(1, "month");
  return date.isSame(nextMonth, "month");
};
const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, "month");
};
const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, "month");
};
</script>

<style lang="scss" scoped>
.default {
  .calendar {
    background: var(--white);

    .week-days {
      &.today {
        .week-day {
          color: var(--white) !important;
          background: var(--secondary);
        }
      }
    }
  }
}

.primary {
  .calendar {
    background: var(--background);

    .week-days {
      &.today {
        .week-day {
          background: var(--white);
          color: var(--text);
        }
      }
    }
  }
}

.issues {
  position: absolute;
  top: 85px;
}

.calendar {
  width: 260px;
  min-height: fit-content;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 0px 2px 0px rgba(5, 9, 26, 0.12),
    0px 4px 8px 0px rgba(5, 9, 26, 0.08), 0px 4px 16px 0px rgba(5, 9, 26, 0.05);
  position: absolute;
  z-index: 3;
  @include media_mobile {
    width: 343px;
  }

  .year-dropdown {
    margin-top: 40px;
    overflow: auto;
    height: 240px;

    div {
      display: flex;
      flex-wrap: wrap;

      p {
        @include font(14px, 400, 20px, var(--text));
        margin: 0;
        padding: 10px 0;
        width: 25%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        &.today {
          background: var(--secondary);
          border-radius: 8px;
          color: var(--white);
        }

        &.selected {
          background: var(--accent);
          border-radius: 8px;
          color: var(--white);
        }
      }
    }
  }

  h2 {
    @include font(16px, 500, 24px, var(--text));
    text-align: center;
    display: flex;
    align-items: center;
    margin: 0;
    @include media_mobile {
      font-size: 18px;
      line-height: 26px;
    }

    i.icon {
      width: 10px;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    box-sizing: border-box;

    i.arrow {
      &.header-arrow {
        position: relative;
        height: 9px;
        margin-left: 6px;
      }
    }
  }

  .block {
    display: flex;

    button {
      border: none;
      border-radius: 16px;
      background: var(--primary_hover);
      display: flex;
      width: 32px;
      height: 32px;
      padding-left: 0px;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      i.arrow {
        width: 12px;
        height: 12px;
        left: 10px;
        top: 14px;

        &::before {
          background: var(--white);
        }
      }

      &.prev {
        transform: rotate(90deg);
      }

      &.next {
        transform: rotate(270deg);
        margin-left: 16px;
      }
    }
  }

  .calendar--block {
    .weeks {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .week {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .week-days {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          @include media_mobile {
            width: 51;
          }

          &.today {
            width: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            @include media_mobile {
              width: 51px;
            }

            .week-day {
              text-align: center;
              width: 32px;
              height: 32px;
              border-radius: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              @include media_mobile {
                width: 40px;
                height: 40px;
                border-radius: 21px;
              }
            }
          }
        }

        .before-current-day {
          .week-day {
            color: var(--placeholder);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .week-day {
          @include font(14px, 400, 20px, var(--text));
          cursor: pointer;
          width: 34px;
          padding: 10px 8px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;

          &.selected {
            background: var(--accent);
            border-radius: 16px;
            color: var(--white);
            width: 32px;
            height: 32px;
            @include media_mobile {
              width: 40px;
              height: 40px;
              border-radius: 21px;
            }
          }

          &:hover {
            background: var(--accent);
            border-radius: 16px;
            width: 32px;
            height: 32px;
            @include media_mobile {
              width: 40px;
              height: 40px;
              border-radius: 21px;
            }

            .week-day {
              color: var(--white);
            }
          }

          @include media_mobile {
            width: 46px;
          }
        }
      }
    }

    .days {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .day {
        @include font(14px, 400, 20px, var(--text));
        cursor: pointer;
        width: 35px;
        padding: 10px 8px;
        text-align: center;

        &.today {
          color: var(--white);
          background: var(--primary);
        }
      }
    }
  }

  .start {
    color: white;
    border-radius: 21px;
    background: var(--primary-primary, #f98347);
    width: 37px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .end {
    color: white;
    border-radius: 21px;
    background: var(--primary-primary, #f98347);
    width: 37px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
