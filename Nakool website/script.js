document.addEventListener("DOMContentLoaded", () => {
    
    // 1. تفعيل التنقل النشط (Active Link) في القائمة حسب مكان التمرير
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-item");

    window.addEventListener("scroll", () => {
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${currentSection}`) {
                item.classList.add("active");
            }
        });
    });

    // 2. إجبار المتصفح على تحميل الملفات بدلاً من فتحها (حل مشكلة التحميل)
    const downloadButtons = document.querySelectorAll(".download-link");

    downloadButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const fileUrl = button.getAttribute("href");
            const fileName = button.getAttribute("download") || "media-file";

            // إذا كان المسار من داخل مجلد الموقع المباشر
            if (!fileUrl.startsWith("http")) return;

            // للميديا الخارجية: جلب الملف وتحويله إلى Blob لضمان نزوله فوراً
            e.preventDefault();
            const originalText = button.querySelector("span").innerText;
            button.querySelector("span").innerText = "جاري التحميل...";

            try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                const tempAnchor = document.createElement("a");
                tempAnchor.href = blobUrl;
                tempAnchor.download = fileName;
                document.body.appendChild(tempAnchor);
                tempAnchor.click();
                
                document.body.removeChild(tempAnchor);
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                // إذا فشل Fetch للروابط الخارجية، افتح رابط التحميل المباشر
                window.location.href = fileUrl;
            } finally {
                button.querySelector("span").innerText = originalText;
            }
        });
    });
});