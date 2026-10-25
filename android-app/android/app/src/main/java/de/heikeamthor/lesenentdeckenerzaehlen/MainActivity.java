package de.heikeamthor.lesenentdeckenerzaehlen;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BackupFilesPlugin.class);
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        // SystemBars.insetsHandling is disabled in capacitor.config.json:
        // its decor-view listener would otherwise also reserve keyboard space.
        // Apply system and keyboard insets once around the entire web surface.
        // Iframes therefore inherit a usable viewport without their own duplicate padding.
        android.view.View content = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(content, (view, windowInsets) -> {
            Insets safe = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars()
                | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        ViewCompat.requestApplyInsets(content);
    }
}
