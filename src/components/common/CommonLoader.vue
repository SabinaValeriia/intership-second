<template lang="pug">
.loader-block
  span.loader
</template>

<style scoped lang="scss">
.loader-block {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20% 0;
  @include media_mobile {
    margin: 71% 0;
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
  box-shadow: 26px 0 var(--accent);
  left: 0;
  top: 0;
  animation: ballMoveX 1s linear infinite;
}
.loader:after {
  box-shadow: none;
  transform-origin: 34px 0;
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
    transform: rotate(210deg);
  }
}
@keyframes ballMoveX {
  0%,
  10% {
    transform: translateX(26px);
  }
  90%,
  100% {
    transform: translateX(0);
  }
}
</style>
