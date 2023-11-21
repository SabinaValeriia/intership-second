<template lang="pug">
.footer
  .footer__block 
    i.icon.home 
    p Home
  .footer__block 
    i.icon.projects 
    p Projects
  .footer__block 
    i.icon.tasks 
    p Issues
  .footer__block 
    i.icon.user 
    p Members
</template>

<style scoped lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  width: calc(100% - 64px);
  background: var(--accent);
  box-shadow: var(--box-shadow-main);
  padding: 6px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__block {
    display: flex;
    align-items: center;
    flex-direction: column;
    &:hover {
      color: var(--background);

      i::before {
        background-color: var(--background);
      }

      p {
        color: var(--background);
      }
    }
    i {
      width: 26px;
      height: 26px;
      margin-bottom: 4px;
      &::before {
        background-color: var(--primary);
      }
    }
    p {
      margin: 30px 0 0 0;
      @include font(12px, 500, 14px, var(--primary));
      cursor: pointer;
    }
  }
}
</style>
