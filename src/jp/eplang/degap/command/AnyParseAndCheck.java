package jp.eplang.degap.command;

import java.io.IOException;

import javax.security.auth.callback.LanguageCallback;

import jp.tonyu.util.ArgsOptions;
import jp.tonyu.util.SFile;

public class AnyParseAndCheck {
    public static void main(String[] args) throws IOException {
        // AnyParseAndCheck dir lang
        ArgsOptions ar=new ArgsOptions(args);
    	AnyParser.main(ar);
        Check.main(ar);
    }
}
