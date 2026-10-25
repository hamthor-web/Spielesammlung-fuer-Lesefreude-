package de.heikeamthor.lesenentdeckenerzaehlen;

import android.app.Activity;
import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "BackupFiles")
public class BackupFilesPlugin extends Plugin {
    private static final int LIMIT = 8 * 1024 * 1024;
    @PluginMethod public void save(PluginCall call) {
        String data = call.getString("data");
        if (data == null || data.getBytes(StandardCharsets.UTF_8).length > LIMIT) {
            call.reject("Die Sicherungsdatei fehlt oder ist zu gross."); return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, call.getString("name", "Lesespiele-Spielstaende.json"));
        startActivityForResult(call, intent, "saved");
    }
    @ActivityCallback private void saved(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            JSObject response = new JSObject(); response.put("canceled", true); call.resolve(response); return;
        }
        try (OutputStream stream = getContext().getContentResolver().openOutputStream(result.getData().getData(), "wt")) {
            if (stream == null) throw new Exception();
            stream.write(call.getString("data").getBytes(StandardCharsets.UTF_8));
            JSObject response = new JSObject(); response.put("canceled", false); call.resolve(response);
        } catch (Exception e) { call.reject("Die Sicherung konnte nicht gespeichert werden."); }
    }
    @PluginMethod public void open(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        startActivityForResult(call, intent, "opened");
    }
    @ActivityCallback private void opened(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            JSObject response = new JSObject(); response.put("canceled", true); call.resolve(response); return;
        }
        try (InputStream stream = getContext().getContentResolver().openInputStream(result.getData().getData());
             ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
            if (stream == null) throw new Exception();
            byte[] buffer = new byte[8192]; int count;
            while ((count = stream.read(buffer)) != -1) {
                if (bytes.size() + count > LIMIT) { call.reject("Die Sicherungsdatei ist zu gross."); return; }
                bytes.write(buffer, 0, count);
            }
            JSObject response = new JSObject(); response.put("canceled", false);
            response.put("data", new String(bytes.toByteArray(), StandardCharsets.UTF_8)); call.resolve(response);
        } catch (Exception e) { call.reject("Die Sicherungsdatei konnte nicht gelesen werden."); }
    }
}
