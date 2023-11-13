<template lang="pug">
.auth-layout
  .group-first
  .group-second
  img.logo(:src="require(`../assets/img/auth_logo.svg`)")
  router-view.auth-layout--block
</template>

<style lang="scss" scoped>
.auth-layout {
  background: var(--white);
  width: 100%;
  height: 100vh;
  &--block {
    z-index: 1;
    position: relative;
  }
  .logo {
    position: absolute;
    top: 32px;
    right: 66px;
    @include media_tablet {
      right: 36px;
    }
    @include media_mobile {
      top: 132px;
      left: 50%;
      transform: translate(-50%, 0%);
    }
    @include media_small_mobile {
      top: 31px;
    }
  }
  .group-second {
    background: url("../assets/img/group2.png");
    position: absolute;
    top: 0;
    left: 0;
    width: 465px;
    height: 596px;
    @include media_tablet {
      background-size: contain;
      top: -6px;
      left: -19px;
      width: 368px;
      height: 472px;
    }
    @include media_mobile {
      background: url("../assets/img/group2-mobile.png");
      top: 0px;
      left: 0px;
      width: 208px;
      height: 270px;
    }
  }
  .group-first {
    background: url("../assets/img/group1.png");
    position: absolute;
    bottom: 0;
    right: 0;
    width: 532px;
    height: 507px;
    @include media_tablet {
      background: url("../assets/img/group1-tablet.png");
      width: 384px;
      height: 372px;
    }
    @include media_mobile {
      background: url("../assets/img/group1-mobile.png");
      width: 246px;
      height: 237px;
    }
  }
}
</style>
