import { action, makeAutoObservable } from "mobx";
import React from "react";
import { RootStore } from "../RootStore/LoginRootStore";

export class SnackbarViewStore {
    root:RootStore
    msg = ''
    showSnackbar = false

    constructor(root:RootStore){
        this.root = root
        makeAutoObservable(this)
    }

    setMsg = action((str:string)=>{
        this.msg = str
    })

    setShowSnackbar = action((bool:boolean)=>{
        this.showSnackbar = bool
    })
}