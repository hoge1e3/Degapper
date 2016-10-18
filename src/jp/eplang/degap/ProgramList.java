package jp.eplang.degap;
import java.io.IOException;
import java.util.Vector;

import jp.tonyu.util.SFile;

public class ProgramList implements Comparable<ProgramList> {
    SFile srcFile;
    String name;
    Vector<Path> learns=new Vector<Path>();
    Vector<String> learnComponents=new Vector<String>();
    public ProgramList(SFile srcFile, String name) {
        this.srcFile=srcFile;
        this.name=name;
    }
    public ProgramList(SFile srcFile) {
        this(srcFile,srcFile.name().replaceAll("\\.\\w+\\.xml$", ""));
    }
    public String xmlSource() throws IOException {
        return srcFile.text();
    }
    public SFile programSourceFile() {
        return srcFile.parent().parent().rel(srcFile.name().replaceAll("\\.xml$", ""));
    }
    public String programSource() throws IOException {
        return programSourceFile().textEnc(SFile.ENC_AUTO);
    }
    @Override
    public int compareTo(ProgramList other) {
        return name.compareTo(other.name);
    }
    @Override
    public String toString() {
        return name;
    }
}
