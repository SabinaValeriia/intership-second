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
  display: flex;
  flex-direction: column;
  justify-content: center;
  &--block {
    z-index: 1;
    position: relative;
    margin-bottom: 10%;
    @include media_mobile {
      margin-bottom: 20%;
    }
  }
  .logo {
    position: absolute;
    top: 32px;
    right: 66px;
    @include media_tablet {
      right: 36px;
    }
    @include media_mobile {
      display: none;
    }
  }
  .group-second {
    background: url("../assets/img/group2.svg") no-repeat;
    position: absolute;
    background-size: contain;
    top: 0;
    left: 0;
    width: 465px;
    height: 596px;
    @include media_tablet {
      top: -6px;
      left: -19px;
      width: 368px;
      height: 472px;
    }
    @include media_mobile {
      top: 0px;
      left: 0px;
      width: 200px;
      height: 256px;
    }
  }
  .group-first {
    background: url("../assets/img/group1.svg") no-repeat;
    background-size: contain;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 531px;
    height: 507px;
    @include media_tablet {
      width: 384px;
      height: 372px;
      bottom: -7px;
    }
    @include media_mobile {
      width: 246px;
      height: 237px;
    }
  }
}
</style>
