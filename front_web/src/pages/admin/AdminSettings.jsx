import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Globe, Mail, Phone, User, Bell, Palette,
  Database, Wifi, Shield, Clock, Save, RefreshCw, Upload,
  Download, CheckCircle, XCircle, AlertCircle, Info, Link,
  Camera, FileText, Zap, Lock, Eye, EyeOff, Copy, ExternalLink,
  Plus, Edit2, Trash2, Image, Type, Menu, ChevronUp, ChevronDown
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { apiService } from '../../services/api';

const AdminSettings = () => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'AI Developer Platform',
    devforgeText: 'DevForge',
    beforeLogo: 'Innovate • Build • Deploy',
    logo: '',
    favicon: '',
    mainHeading: 'Welcome to Our Platform',
    subHeading: 'Building amazing digital experiences',
    projectDisplayName: 'Portfolio Projects'
  });
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    address: '',
  });
  const [navbarLinks, setNavbarLinks] = useState([]);
  const [heroSections, setHeroSections] = useState([]);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('branding');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    url: '',
    order: 0,
    is_active: true,
    open_in_new_tab: false
  });
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    subtitle: '',
    badge_text: '',
    primary_button_text: 'Explore Projects',
    primary_button_url: '/projects',
    secondary_button_text: 'Join Community',
    secondary_button_url: '/hiring',
    stat1_label: 'Projects',
    stat1_value: '250+',
    stat2_label: 'Developers',
    stat2_value: '1.2k',
    stat3_label: 'Resources',
    stat3_value: '45k',
    is_active: true
  });

  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are allowed
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateLinkForm = () => {
    const newErrors = {};

    if (!linkFormData.title.trim()) {
      newErrors.title = 'Link title is required';
    }

    if (!linkFormData.url.trim()) {
      newErrors.url = 'Link URL is required';
    } else if (!validateUrl(linkFormData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSiteSettings = () => {
    const newErrors = {};

    // Only validate fields that are actually being used/sent
    if (siteSettings.devforgeText && !siteSettings.devforgeText.trim()) {
      newErrors.devforgeText = 'Site heading is required';
    }

    if (siteSettings.subHeading && !siteSettings.subHeading.trim()) {
      newErrors.subHeading = 'Sub heading is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSiteSettings = async () => {
    if (!validateSiteSettings()) return;

    try {
      const formData = new FormData();

      // Map frontend field names to backend field names
      formData.append('heading', siteSettings.devforgeText || 'DEVFORGE');
      formData.append('subheading', siteSettings.subHeading || 'Building amazing digital experiences');

      if (logoFile) {
        formData.append('logo', logoFile);
      } else {
        // If no new file is selected, we need to send the current logo URL
        // or handle it differently to avoid the "No file was submitted" error
        // Option 1: Don't send logo field at all if not changing it
        // Option 2: Send empty string to clear it
        // Let's try Option 1 first - don't send logo field
      }

      await apiService.updateSiteSettings(formData);
      alert('Site settings saved successfully!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Error saving site settings');
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveContact = async () => {
    try {
      if (contactData.id) {
        await apiService.updateContact(contactData.id, contactData);
      } else {
        await apiService.createContact(contactData);
      }

      alert("Contact saved successfully!");
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("Error saving contact");
    }
  };

  const handleLogoUrlChange = (value) => {
    setSiteSettings({ ...siteSettings, logo: value });
    setLogoPreview(value);
    setLogoFile(null);
  };

  const handleAddLink = async () => {
    if (!validateLinkForm()) return;

    try {
      const response = await apiService.createNavbarLink(linkFormData);
      setNavbarLinks([...navbarLinks, response.data]);
      setLinkFormData({
        title: '',
        url: '',
        order: 0,
        is_active: true,
        open_in_new_tab: false
      });
      setIsLinkModalOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Error creating navbar link:', error);
      alert('Error creating navbar link');
    }
  };

  const handleUpdateLink = async () => {
    if (!validateLinkForm()) return;

    try {
      await apiService.updateNavbarLink(editingLink.id, linkFormData);
      setNavbarLinks(navbarLinks.map(link =>
        link.id === editingLink.id
          ? { ...linkFormData, id: editingLink.id }
          : link
      ));

      setLinkFormData({
        title: '',
        url: '',
        order: 0,
        is_active: true,
        open_in_new_tab: false
      });
      setEditingLink(null);
      setIsLinkModalOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Error updating navbar link:', error);
      alert('Error updating navbar link');
    }
  };
  const handleDeleteLink = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await apiService.deleteNavbarLink(id);
        setNavbarLinks(navbarLinks.filter(link => link.id !== id));
      } catch (error) {
        console.error('Error deleting navbar link:', error);
        alert('Error deleting navbar link');
      }
    }
  };

  const openLinkModal = (link = null) => {
    if (link) {
      setEditingLink(link);
      setLinkFormData({
        title: link.title,
        url: link.url,
        order: link.order,
        is_active: link.is_active,
        open_in_new_tab: link.open_in_new_tab
      });
    } else {
      setEditingLink(null);
      setLinkFormData({
        title: '',
        url: '',
        order: navbarLinks.length,
        is_active: true,
        open_in_new_tab: false
      });
    }
    setIsLinkModalOpen(true);
    setErrors({});
  };

  const handleAddHero = async () => {
    try {
      const response = await apiService.createHeroSection(heroFormData);
      setHeroSections([...heroSections, response.data]);
      setHeroFormData({
        title: '',
        subtitle: '',
        badge_text: '',
        primary_button_text: 'Explore Projects',
        primary_button_url: '/projects',
        secondary_button_text: 'Join Community',
        secondary_button_url: '/hiring',
        stat1_label: 'Projects',
        stat1_value: '250+',
        stat2_label: 'Developers',
        stat2_value: '1.2k',
        stat3_label: 'Resources',
        stat3_value: '45k',
        is_active: true
      });
      setIsHeroModalOpen(false);
      setEditingHero(null);
    } catch (error) {
      console.error('Error creating hero section:', error);
      alert('Error creating hero section');
    }
  };

  const handleUpdateHero = async () => {
    try {
      await apiService.updateHeroSection(editingHero.id, heroFormData);
      setHeroSections(heroSections.map(hero =>
        hero.id === editingHero.id
          ? { ...heroFormData, id: editingHero.id }
          : hero
      ));
      setHeroFormData({
        title: '',
        subtitle: '',
        badge_text: '',
        primary_button_text: 'Explore Projects',
        primary_button_url: '/projects',
        secondary_button_text: 'Join Community',
        secondary_button_url: '/hiring',
        stat1_label: 'Projects',
        stat1_value: '250+',
        stat2_label: 'Developers',
        stat2_value: '1.2k',
        stat3_label: 'Resources',
        stat3_value: '45k',
        is_active: true
      });
      setEditingHero(null);
      setIsHeroModalOpen(false);
    } catch (error) {
      console.error('Error updating hero section:', error);
      alert('Error updating hero section');
    }
  };

  const handleDeleteHero = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero section?')) {
      try {
        await apiService.deleteHeroSection(id);
        setHeroSections(heroSections.filter(hero => hero.id !== id));
      } catch (error) {
        console.error('Error deleting hero section:', error);
        alert('Error deleting hero section');
      }
    }
  };

  const handleSaveFooter = async () => {
    try {
      const footerDataToUpdate = {
        email: footerData?.email || '',
        phone: footerData?.phone || '',
        address: footerData?.address || '',
        company_description: footerData?.company_description || '',
        social_links: footerData?.social_links || {},
        copyright_text: footerData?.copyright_text || ''
      };

      if (footerData?.id) {
        await apiService.updateFooter(footerData.id, footerDataToUpdate);
      } else {
        await apiService.createFooter(footerDataToUpdate);
      }

      alert('Footer settings saved successfully!');
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert('Error saving footer settings');
    }
  };

  const handleFooterChange = (field, value) => {
    if (field === 'social_links') {
      setFooterData(prev => ({
        ...prev,
        social_links: value
      }));
    } else {
      setFooterData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const openHeroModal = (hero = null) => {
    if (hero) {
      setEditingHero(hero);
      setHeroFormData({
        title: hero.title,
        subtitle: hero.subtitle,
        badge_text: hero.badge_text,
        primary_button_text: hero.primary_button_text,
        primary_button_url: hero.primary_button_url,
        secondary_button_text: hero.secondary_button_text,
        secondary_button_url: hero.secondary_button_url,
        stat1_label: hero.stat1_label,
        stat1_value: hero.stat1_value,
        stat2_label: hero.stat2_label,
        stat2_value: hero.stat2_value,
        stat3_label: hero.stat3_label,
        stat3_value: hero.stat3_value,
        is_active: hero.is_active
      });
    } else {
      setEditingHero(null);
      setHeroFormData({
        title: '',
        subtitle: '',
        badge_text: '',
        primary_button_text: 'Explore Projects',
        primary_button_url: '/projects',
        secondary_button_text: 'Join Community',
        secondary_button_url: '/hiring',
        stat1_label: 'Projects',
        stat1_value: '250+',
        stat2_label: 'Developers',
        stat2_value: '1.2k',
        stat3_label: 'Resources',
        stat3_value: '45k',
        is_active: true
      });
    }
    setIsHeroModalOpen(true);
  };

  const moveLink = (id, direction) => {
    const index = navbarLinks.findIndex(link => link.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === navbarLinks.length - 1)
    ) {
      return;
    }

    const newLinks = [...navbarLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap positions
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

    // Update order values
    newLinks.forEach((link, i) => {
      link.order = i;
    });

    setNavbarLinks(newLinks);
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch site settings
        const settingsResponse = await apiService.getSiteSettings();
        if (settingsResponse.data && settingsResponse.data.length > 0) {
          const data = settingsResponse.data[0];
          setSiteSettings({
            siteName: data.site_name || 'AI Developer Platform',
            devforgeText: data.heading || 'DevForge',
            beforeLogo: data.before_logo || 'Innovate • Build • Deploy',
            logo: data.logo || '',
            favicon: data.favicon || '',
            mainHeading: data.main_heading || 'Welcome to Our Platform',
            subHeading: data.subheading || 'Building amazing digital experiences',
            projectDisplayName: data.project_display_name || 'Portfolio Projects'
          });
          setLogoPreview(data.logo || '');
        }

        // Fetch navbar links from API
        const navbarResponse = await apiService.getNavbarLinks();
        if (navbarResponse.data) {
          setNavbarLinks(navbarResponse.data);
        }

        // Fetch hero sections from API
        const heroResponse = await apiService.getHeroSections();
        if (heroResponse.data) {
          setHeroSections(heroResponse.data);
        }
        const contactResponse = await apiService.getContact();

        if (contactResponse.data.length > 0) {
          setContactData(contactResponse.data[0]);
        }

        // Fetch footer data from API
        const footerResponse = await apiService.getFooter();
        if (footerResponse.data && footerResponse.data.length > 0) {
          setFooterData(footerResponse.data[0]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default values if API fails
        setNavbarLinks([
          { id: 1, title: 'Home', url: '/', order: 0, is_active: true, open_in_new_tab: false },
          { id: 2, title: 'Projects', url: '/projects', order: 1, is_active: true, open_in_new_tab: false },
          { id: 3, title: 'Developers', url: '/developers', order: 2, is_active: true, open_in_new_tab: false },
          { id: 4, title: 'Hiring', url: '/hiring', order: 3, is_active: true, open_in_new_tab: false }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'navbar', label: 'Navbar', icon: Menu },
    { id: 'hero', label: 'Hero Section', icon: Globe },
    { id: 'footer', label: 'Footer', icon: Mail },
    { id: 'Contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Settings</h1>
              <p className="text-gray-600 text-sm">Manage logo, project name, headings, and navbar links dynamically.</p>
            </div>

          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-8 p-1 bg-white border border-gray-200 rounded-xl w-fit shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Branding Settings */}
            {activeTab === 'branding' && (
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" /> Branding & Content
                </h3>

                <div className="space-y-6">
                  {/* Logo Management */}
                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-3">Site Logo</label>

                    {/* Logo Preview */}
                    {logoPreview && (
                      <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-gray-200 mb-4">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain bg-gray-50"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/128x64/1a1a1a/ffffff?text=LOGO';
                          }}
                        />
                      </div>
                    )}

                    {/* Logo Upload Options */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all text-sm text-gray-900">
                          <Upload className="w-4 h-4" />
                          <span>Upload Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileChange}
                            className="hidden"
                          />
                        </label>
                        {logoFile && (
                          <p className="text-xs text-green-600 font-medium mt-2">
                            Selected: {logoFile.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={siteSettings.logo}
                          onChange={(e) => handleLogoUrlChange(e.target.value)}
                          placeholder="Or enter logo URL..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Live Preview</h4>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">{siteSettings.beforeLogo}</span>
                        {logoPreview && (
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{siteSettings.devforgeText}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">This is how your branding elements will appear in the header.</p>
                  </div>

                  {/* Site Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Site Name</label>
                      <input
                        type="text"
                        value={siteSettings.siteName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.siteName ? 'border-red-500' : ''}`}
                      />
                      {errors.siteName && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.siteName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">DevForge Text</label>
                      <input
                        type="text"
                        value={siteSettings.devforgeText}
                        onChange={(e) => setSiteSettings({ ...siteSettings, devforgeText: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="DevForge"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Before Logo Text</label>
                      <input
                        type="text"
                        value={siteSettings.beforeLogo}
                        onChange={(e) => setSiteSettings({ ...siteSettings, beforeLogo: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Innovate • Build • Deploy"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Project Display Name</label>
                      <input
                        type="text"
                        value={siteSettings.projectDisplayName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, projectDisplayName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Portfolio Projects"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Main Heading</label>
                      <input
                        type="text"
                        value={siteSettings.mainHeading}
                        onChange={(e) => setSiteSettings({ ...siteSettings, mainHeading: e.target.value })}
                        className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all ${errors.mainHeading ? 'border-red-500/50' : ''}`}
                      />
                      {errors.mainHeading && (
                        <p className="text-red-500 text-[9px] mt-1 flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" />
                          {errors.mainHeading}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Sub Heading</label>
                      <input
                        type="text"
                        value={siteSettings.subHeading}
                        onChange={(e) => setSiteSettings({ ...siteSettings, subHeading: e.target.value })}
                        className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all ${errors.subHeading ? 'border-red-500/50' : ''}`}
                      />
                      {errors.subHeading && (
                        <p className="text-red-500 text-[9px] mt-1 flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" />
                          {errors.subHeading}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Favicon URL</label>
                      <input
                        type="url"
                        value={siteSettings.favicon}
                        onChange={(e) => setSiteSettings({ ...siteSettings, favicon: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] placeholder-zinc-600 focus:border-blue-500/50 outline-none transition-all"
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSiteSettings}
                    className="w-full py-2 accent-gradient text-white rounded-lg text-[11px] font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all uppercase tracking-widest"
                  >
                    Save Branding Settings
                  </button>
                </div>
              </div>
            )}

            {/* Navbar Settings */}
            {activeTab === 'navbar' && (
              <div className="p-6 glass-card border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-white serif flex items-center gap-2">
                    <Menu className="w-4 h-4 text-blue-500" /> Navigation Links
                  </h3>
                  <button
                    onClick={() => openLinkModal()}
                    className="px-3 py-1.5 accent-gradient text-white text-[11px] font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                </div>

                <div className="space-y-3">
                  {navbarLinks.length === 0 ? (
                    <div className="text-center py-12">
                      <Menu className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-white mb-2">No navbar links</h4>
                      <p className="text-zinc-500 text-sm mb-6">Add your first navigation link to get started.</p>
                      <button
                        onClick={() => openLinkModal()}
                        className="px-4 py-2 accent-gradient text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add First Link
                      </button>
                    </div>
                  ) : (
                    navbarLinks
                      .sort((a, b) => a.order - b.order)
                      .map((link, index) => (
                        <div key={link.id} className="p-4 bg-white/5 border border-white/5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-500 font-bold w-4">{index + 1}</span>
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                  <Link className="w-4 h-4 text-blue-500" />
                                </div>
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm">{link.title}</p>
                                <p className="text-[9px] text-zinc-500">{link.url}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {link.is_active ? (
                                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                    Active
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-white/5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                    Inactive
                                  </span>
                                )}
                                {link.open_in_new_tab && (
                                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                    New Tab
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => moveLink(link.id, 'up')}
                                  disabled={index === 0}
                                  className="p-1 text-zinc-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => moveLink(link.id, 'down')}
                                  disabled={index === navbarLinks.length - 1}
                                  className="p-1 text-zinc-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => openLinkModal(link)}
                                className="p-1 text-zinc-500 hover:text-blue-500 transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Hero Section Settings */}
            {activeTab === 'hero' && (
              <div className="p-6 glass-card border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-white serif flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" /> Hero Sections
                  </h3>
                  <button
                    onClick={() => openHeroModal()}
                    className="px-3 py-1.5 accent-gradient text-white text-[11px] font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" /> Add Hero Section
                  </button>
                </div>

                <div className="space-y-3">
                  {heroSections.length === 0 ? (
                    <div className="text-center py-12">
                      <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-white mb-2">No hero sections</h4>
                      <p className="text-zinc-500 text-sm mb-6">Create your first hero section to customize the homepage.</p>
                      <button
                        onClick={() => openHeroModal()}
                        className="px-4 py-2 accent-gradient text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create First Hero Section
                      </button>
                    </div>
                  ) : (
                    heroSections.map((hero, index) => (
                      <div key={hero.id} className="p-4 bg-white/5 border border-white/5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-zinc-500 font-bold w-4">{index + 1}</span>
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-blue-500" />
                              </div>
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">{hero.title}</p>
                              <p className="text-[9px] text-zinc-500 line-clamp-1">{hero.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {hero.is_active ? (
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                  Active
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-white/5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openHeroModal(hero)}
                              className="p-1 text-zinc-500 hover:text-blue-500 transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleDeleteHero(hero.id)}
                              className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Footer Settings */}
            {activeTab === 'footer' && (
              <div className="p-6 glass-card border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-white serif flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Footer Settings
                  </h3>
                  <button
                    onClick={handleSaveFooter}
                    className="px-4 py-2 accent-gradient text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                  >
                    Save Footer
                  </button>
                </div>

                {footerData ? (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-4">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-white mb-2">Email</label>
                          <input
                            type="email"
                            value={footerData.email || ''}
                            onChange={(e) => handleFooterChange('email', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50"
                            placeholder="contact@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white mb-2">Phone</label>
                          <input
                            type="text"
                            value={footerData.phone || ''}
                            onChange={(e) => handleFooterChange('phone', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-white mb-2">Address</label>
                        <textarea
                          value={footerData.address || ''}
                          onChange={(e) => handleFooterChange('address', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50 h-20 resize-none"
                          placeholder="123 Business Street, City, State 12345"
                        />
                      </div>
                    </div>

                    {/* Company Description */}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-4">Company Description</h4>
                      <textarea
                        value={footerData.company_description || ''}
                        onChange={(e) => handleFooterChange('company_description', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50 h-24 resize-none"
                        placeholder="Brief description of your company for the footer"
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-4">Social Links</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-bold text-white w-20">GitHub</label>
                          <input
                            type="url"
                            value={footerData.social_links?.github || ''}
                            onChange={(e) => handleFooterChange('social_links', {
                              ...footerData.social_links,
                              github: e.target.value
                            })}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50"
                            placeholder="https://github.com/yourcompany"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-bold text-white w-20">Twitter</label>
                          <input
                            type="url"
                            value={footerData.social_links?.twitter || ''}
                            onChange={(e) => handleFooterChange('social_links', {
                              ...footerData.social_links,
                              twitter: e.target.value
                            })}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50"
                            placeholder="https://twitter.com/yourcompany"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-bold text-white w-20">LinkedIn</label>
                          <input
                            type="url"
                            value={footerData.social_links?.linkedin || ''}
                            onChange={(e) => handleFooterChange('social_links', {
                              ...footerData.social_links,
                              linkedin: e.target.value
                            })}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50"
                            placeholder="https://linkedin.com/company/yourcompany"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Copyright Text */}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-4">Copyright Text</h4>
                      <input
                        type="text"
                        value={footerData.copyright_text || ''}
                        onChange={(e) => handleFooterChange('copyright_text', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500/50"
                        placeholder="© 2026 Your Company. All rights reserved."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 text-sm">No footer settings found. Please create footer settings.</p>
                  </div>
                )}
              </div>
            )}
            {/* Contact Settings */}
            {activeTab === 'Contact' && (
              <div className="p-6 glass-card border-white/5">
                <h3 className="text-base font-bold text-white serif mb-6 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" /> Contact Settings
                </h3>

                <div className="space-y-4">

                  {/* Email */}
                  <div>
                    <label className="text-xs text-white">Email</label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) =>
                        setContactData({ ...contactData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs text-white">Phone</label>
                    <input
                      type="text"
                      value={contactData.phone}
                      onChange={(e) =>
                        setContactData({ ...contactData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-xs text-white">Address</label>
                    <textarea
                      value={contactData.address}
                      onChange={(e) =>
                        setContactData({ ...contactData, address: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <button
                    onClick={handleSaveContact}
                    className="w-full py-2 accent-gradient text-white rounded-lg"
                  >
                    Save Contact
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Link Modal */}
          <AnimatePresence>
            {isLinkModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsLinkModalOpen(false)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-md glass-card border-white/10 p-6 relative z-10"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white serif">
                      {editingLink ? 'Edit Link' : 'Add New Link'}
                    </h2>
                    <button onClick={() => setIsLinkModalOpen(false)} className="p-1.5 text-zinc-500 hover:text-white">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Link Title</label>
                      <input
                        type="text"
                        value={linkFormData.title}
                        onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                        className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all ${errors.title ? 'border-red-500/50' : ''}`}
                        placeholder="Home"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-[9px] mt-1 flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Link URL</label>
                      <input
                        type="text"
                        value={linkFormData.url}
                        onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                        className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all ${errors.url ? 'border-red-500/50' : ''}`}
                        placeholder="/"
                      />
                      {errors.url && (
                        <p className="text-red-500 text-[9px] mt-1 flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" />
                          {errors.url}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={linkFormData.is_active}
                          onChange={(e) => setLinkFormData({ ...linkFormData, is_active: e.target.checked })}
                          className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500/20"
                        />
                        <span className="text-xs font-bold text-white">Active</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={linkFormData.open_in_new_tab}
                          onChange={(e) => setLinkFormData({ ...linkFormData, open_in_new_tab: e.target.checked })}
                          className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500/20"
                        />
                        <span className="text-xs font-bold text-white">Open in new tab</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsLinkModalOpen(false)}
                        className="flex-grow py-2.5 bg-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={editingLink ? handleUpdateLink : handleAddLink}
                        className="flex-grow py-2.5 accent-gradient text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                      >
                        {editingLink ? 'Update Link' : 'Add Link'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Hero Modal */}
          <AnimatePresence>
            {isHeroModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsHeroModalOpen(false)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-2xl glass-card border-white/10 p-6 relative z-10 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white serif">
                      {editingHero ? 'Edit Hero Section' : 'Create New Hero Section'}
                    </h2>
                    <button onClick={() => setIsHeroModalOpen(false)} className="p-1.5 text-zinc-500 hover:text-white">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Hero Title</label>
                        <input
                          type="text"
                          value={heroFormData.title}
                          onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                          placeholder="Architectural Precision for Modern Teams"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Badge Text</label>
                        <input
                          type="text"
                          value={heroFormData.badge_text}
                          onChange={(e) => setHeroFormData({ ...heroFormData, badge_text: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                          placeholder="V2.0 Now Architected"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Hero Subtitle</label>
                      <textarea
                        value={heroFormData.subtitle}
                        onChange={(e) => setHeroFormData({ ...heroFormData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all h-20 resize-none"
                        placeholder="DevForge transforms chaotic technical debt into an organized, high-performance workspace..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Primary Button Text</label>
                        <input
                          type="text"
                          value={heroFormData.primary_button_text}
                          onChange={(e) => setHeroFormData({ ...heroFormData, primary_button_text: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                          placeholder="Explore Projects"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Primary Button URL</label>
                        <input
                          type="text"
                          value={heroFormData.primary_button_url}
                          onChange={(e) => setHeroFormData({ ...heroFormData, primary_button_url: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                          placeholder="/projects"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Secondary Button Text</label>
                        <input
                          type="text"
                          value={heroFormData.secondary_button_text}
                          onChange={(e) => setHeroFormData({ ...heroFormData, secondary_button_text: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                          placeholder="Join Community"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Secondary Button URL</label>
                        <input
                          type="text"
                          value={heroFormData.secondary_button_url}
                          onChange={(e) => setHeroFormData({ ...heroFormData, secondary_button_url: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                          placeholder="/hiring"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Statistics Display</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={heroFormData.stat1_value}
                            onChange={(e) => setHeroFormData({ ...heroFormData, stat1_value: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                            placeholder="250+"
                          />
                          <input
                            type="text"
                            value={heroFormData.stat1_label}
                            onChange={(e) => setHeroFormData({ ...heroFormData, stat1_label: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                            placeholder="Projects"
                          />
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={heroFormData.stat2_value}
                            onChange={(e) => setHeroFormData({ ...heroFormData, stat2_value: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                            placeholder="1.2k"
                          />
                          <input
                            type="text"
                            value={heroFormData.stat2_label}
                            onChange={(e) => setHeroFormData({ ...heroFormData, stat2_label: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                            placeholder="Developers"
                          />
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={heroFormData.stat3_value}
                            onChange={(e) => setHeroFormData({ ...heroFormData, stat3_value: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                            placeholder="45k"
                          />
                          <input
                            type="text"
                            value={heroFormData.stat3_label}
                            onChange={(e) => setHeroFormData({ ...heroFormData, stat3_label: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:border-blue-500/50 outline-none transition-all"
                            placeholder="Resources"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={heroFormData.is_active}
                          onChange={(e) => setHeroFormData({ ...heroFormData, is_active: e.target.checked })}
                          className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500/20"
                        />
                        <span className="text-xs font-bold text-white">Active</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsHeroModalOpen(false)}
                        className="flex-grow py-2.5 bg-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={editingHero ? handleUpdateHero : handleAddHero}
                        className="flex-grow py-2.5 accent-gradient text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                      >
                        {editingHero ? 'Update Hero Section' : 'Create Hero Section'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
