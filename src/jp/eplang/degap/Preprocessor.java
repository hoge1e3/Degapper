package jp.eplang.degap;

public class Preprocessor {
    public static String run(String s) {
        StringBuffer buf=new StringBuffer();
        for (String l:s.split("\\n")) {
            if (l.matches("^\\s*#.*")) {
                buf.append("\n");
                continue;
            }
            buf.append(l+"\n");
        }
        return buf+"";
    }
}
