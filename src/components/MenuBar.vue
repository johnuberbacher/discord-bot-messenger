<template>
  <div class="menu-bar">
    <div class="draggable">Discord&nbsp;Bot&nbsp;Messenger</div>
    <div class="menu-button" @click="minimizeWindow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
      </svg>
    </div>
    <div class="menu-button" @click="toggleMaximize">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    </div>
    <div class="menu-button" @click="closeWindow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
</template>
<script setup>
import { ipcRenderer } from "electron";

const getWindow = () => ipcRenderer.sendSync("getFocusedWindow");

function minimizeWindow() {
  ipcRenderer.send("minimizeWindow");
}

function toggleMaximize() {
  ipcRenderer.send("toggleMaximize");
}

function closeWindow() {
  ipcRenderer.send("closeWindow");
}
</script>
<style scoped lang="scss">
.menu-bar {
  background-color: var(--base-500);
  height: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 0;
  .draggable {
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1px 12px 0px 12px;
    font-size: 12px;
    font-family: "gg sans bold", sans-serif;
  }
  .menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 22px;
    width: 34px;
    background-color: var(--base-500);
    color: var(--base-text);
    transition: 0.17s background-color ease, 0.17s color ease;
    cursor: pointer;
    &:last-of-type {
      &:hover {
        background-color: var(--base-danger);
      }
      svg {
        width: 0.95rem;
        height: 0.95rem;
      }
    }
    &:hover {
      background-color: var(--base-300);
      color: var(--base-text);
    }
    &:active {
      background-color: var(--base-200);
      color: var(--base-text);
    }
    svg {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
}
</style>
