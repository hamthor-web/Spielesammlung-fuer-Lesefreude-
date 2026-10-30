import java.awt.*;
import java.io.*;
import java.nio.file.*;
import java.security.*;
import java.security.cert.*;
import java.util.*;
import java.util.jar.*;
import java.util.zip.*;
import javax.swing.*;
import jdk.security.jarsigner.JarSigner;

public class UpdateSignieren {
  static final String EXPECTED_CERT="EA14AD75C7EFFEA842B6E8BF9FFF61DF3863DC56AC2C1DF60A6889148F0EE70C";
  static final String EXPECTED_AAB="A1D4D1C4990ED677B1769296A5A41D17224B1454D2E57789A8A73617D4B5B775";
  static String hex(byte[] b){return HexFormat17.hex(b);}
  static String hash(Path p) throws Exception {MessageDigest d=MessageDigest.getInstance("SHA-256");try(InputStream in=Files.newInputStream(p)){byte[] b=new byte[65536];for(int n;(n=in.read(b))!=-1;)d.update(b,0,n);}return hex(d.digest());}
  static String fingerprint(java.security.cert.Certificate c) throws Exception{return hex(MessageDigest.getInstance("SHA-256").digest(c.getEncoded()));}
  static void sign(Path input,Path store,char[] password,char[] keyPassword,Path output,String expectedCert,String expectedAab) throws Exception {
    if(!hash(input).equals(expectedAab))throw new Exception("Die AAB passt nicht zu diesem Update 1.1.23. Bitte die mitgelieferte unsigned.aab wählen.");
    KeyStore ks=KeyStore.getInstance(store.toFile(),password);String alias=null;
    Enumeration<String> names=ks.aliases();while(names.hasMoreElements()){String a=names.nextElement();if(ks.isKeyEntry(a)&&ks.getCertificate(a)!=null&&fingerprint(ks.getCertificate(a)).equals(expectedCert)){if(alias!=null)throw new Exception("Mehrere passende Schlüssel vorhanden.");alias=a;}}
    if(alias==null)throw new Exception("Die Signierdatei enthält nicht den bisherigen Upload-Schlüssel. Es wurde nichts signiert.");
    PrivateKey key=(PrivateKey)ks.getKey(alias,keyPassword);if(key==null)throw new Exception("Schlüssel nicht verfügbar.");
    CertPath chain=CertificateFactory.getInstance("X.509").generateCertPath(Arrays.asList(ks.getCertificateChain(alias)));
    JarSigner signer=new JarSigner.Builder(key,chain).digestAlgorithm("SHA-256").signatureAlgorithm("SHA256withRSA").signerName("LESEUPD").build();
    Path temp=Files.createTempFile(output.getParent(),"lesespiele-signierung-",".tmp");
    try {
      try(ZipFile zip=new ZipFile(input.toFile());OutputStream out=Files.newOutputStream(temp)){signer.sign(zip,out);}
      try(JarFile jar=new JarFile(temp.toFile(),true)){
        Enumeration<JarEntry> entries=jar.entries();byte[] buffer=new byte[65536];int checked=0;
        while(entries.hasMoreElements()){JarEntry e=entries.nextElement();if(e.isDirectory())continue;try(InputStream in=jar.getInputStream(e)){while(in.read(buffer)!=-1){}}
          if(e.getName().toUpperCase(Locale.ROOT).startsWith("META-INF/"))continue;
          CodeSigner[] signers=e.getCodeSigners();boolean valid=false;
          if(signers!=null)for(CodeSigner cs:signers)if(fingerprint(cs.getSignerCertPath().getCertificates().get(0)).equals(expectedCert))valid=true;
          if(!valid)throw new Exception("Signaturprüfung fehlgeschlagen: "+e.getName());checked++;
        }if(checked==0)throw new Exception("Die AAB enthält keine geprüften Inhaltsdateien.");
      }
      Files.move(temp,output,StandardCopyOption.REPLACE_EXISTING);
    } finally {Files.deleteIfExists(temp);}
  }
  static Path choose(Component owner,String title,String extension){JFileChooser f=new JFileChooser();f.setDialogTitle(title);f.setFileFilter(new javax.swing.filechooser.FileNameExtensionFilter(extension,extension));return f.showOpenDialog(owner)==JFileChooser.APPROVE_OPTION?f.getSelectedFile().toPath().toAbsolutePath():null;}
  public static void main(String[] args) throws Exception {
    if(args.length==4&&args[0].equals("--self-test")){char[] p=System.getenv("SIG_TEST_PASS").toCharArray();try{sign(Paths.get(args[1]),Paths.get(args[2]),p,p,Paths.get(args[3]),System.getenv("SIG_TEST_CERT"),System.getenv("SIG_TEST_AAB"));}finally{Arrays.fill(p,'\0');}return;}
    SwingUtilities.invokeLater(()->{
      JFrame frame=new JFrame("Lesespiele 1.1.23 – Store-Update signieren");frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
      JPanel panel=new JPanel(new GridLayout(0,1,8,8));panel.setBorder(BorderFactory.createEmptyBorder(18,20,18,20));
      panel.add(new JLabel("Passwörter werden nur lokal verwendet und nicht gespeichert."));
      panel.add(new JLabel("1. Wähle das unsigned.aab und deine bisherige android.keystore."));
      panel.add(new JLabel("Keystore-Passwort:"));JPasswordField pass=new JPasswordField(30);panel.add(pass);
      panel.add(new JLabel("Schlüssel-Passwort (leer lassen, wenn identisch):"));JPasswordField keyPass=new JPasswordField(30);panel.add(keyPass);
      JButton button=new JButton("AAB und Schlüssel wählen · signieren");panel.add(button);JLabel status=new JLabel("Bereit.");panel.add(status);
      button.addActionListener(event->{
        Path aab=choose(frame,"Unsigned AAB 1.1.23 auswählen","aab");if(aab==null)return;
        Path store=choose(frame,"Bisherige android.keystore auswählen","keystore");if(store==null)return;
        char[] p=pass.getPassword(),k=keyPass.getPassword();if(k.length==0)k=p.clone();pass.setText("");keyPass.setText("");
        if(p.length==0){Arrays.fill(k,'\0');JOptionPane.showMessageDialog(frame,"Bitte zuerst das Keystore-Passwort eingeben.");return;}
        Path output=aab.resolveSibling("Lesespiele-Play-1.1.23.aab");
        if(Files.exists(output)&&JOptionPane.showConfirmDialog(frame,"Die Ausgabedatei existiert bereits. Ersetzen?","Ausgabe",JOptionPane.YES_NO_OPTION)!=JOptionPane.YES_OPTION){Arrays.fill(p,'\0');Arrays.fill(k,'\0');return;}
        final char[] kp=k;button.setEnabled(false);status.setText("Signierung und Prüfung laufen …");
        new SwingWorker<Void,Void>(){protected Void doInBackground() throws Exception {try{sign(aab,store,p,kp,output,EXPECTED_CERT,EXPECTED_AAB);}finally{Arrays.fill(p,'\0');Arrays.fill(kp,'\0');}return null;}
          protected void done(){button.setEnabled(true);try{get();status.setText("Signiert und geprüft.");JOptionPane.showMessageDialog(frame,"Fertig für die Play Console:\n"+output,"Signatur geprüft",JOptionPane.INFORMATION_MESSAGE);}catch(Exception ex){status.setText("Signierung nicht abgeschlossen.");Throwable cause=ex.getCause()==null?ex:ex.getCause();JOptionPane.showMessageDialog(frame,cause.getMessage(),"Bitte prüfen",JOptionPane.ERROR_MESSAGE);}}
        }.execute();
      });frame.setContentPane(panel);frame.pack();frame.setLocationRelativeTo(null);frame.setVisible(true);
    });
  }
  // Java 11 compatible hex encoding.
  static class HexFormat17 {static String hex(byte[] bytes){StringBuilder b=new StringBuilder();for(byte v:bytes)b.append(String.format("%02X",v&255));return b.toString();}}
}
