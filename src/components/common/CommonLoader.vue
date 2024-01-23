<template lang="pug">
.loader-block
  span.loader
</template>

<style lang="scss" scoped>
.loader-block {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20% 0;
  @include media_mobile {
    margin: 71% 0;
  }

  &.work-block {
    margin: 130px 50% 130px 46%;
    @include media_tablet {
      margin: 130px 50% 90px 42%;
    }
    //@include media_mobile {
    //  margin: 81px 50% 90px 42%;
    //}

    .loader:before,
    .loader:after {
      top: -35px;
      @include media_mobile {
        top: 33%;
      }
    }
  }

  &.user {
    .loader {
      position: absolute;
      top: 63%;
      left: 48%;
    }
  }
}

.loader {
  position: relative;
  @include media_mobile {
    position: absolute;
    left: 41%;
    top: 50%;
  }
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 20px 0 var(--accent);
  left: 0;
  top: 0;
  animation: ballMoveX 1s linear infinite;
}

.loader:after {
  box-shadow: none;
  transform-origin: 28px 0;
  transform: rotate(210deg);
  animation: rotateLoader 1s linear infinite;
}

@keyframes rotateLoader {
  0%,
  10% {
    transform: rotate(0deg);
  }
  90%,
  100% {
    transform: rotate(150deg);
  }
}

@keyframes ballMoveX {
  0%,
  10% {
    transform: translateX(20px);
  }
  90%,
  100% {
    transform: translateX(0);
  }
}
</style>
