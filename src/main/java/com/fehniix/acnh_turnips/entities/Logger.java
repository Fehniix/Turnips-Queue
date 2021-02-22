package com.fehniix.acnh_turnips.entities;

import org.springframework.boot.ansi.*;

public final class Logger {

    public static final void log(Object... message) {
        System.out.println(AnsiOutput.toString(message));
    }

}
