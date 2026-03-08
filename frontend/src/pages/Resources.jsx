import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const blogPosts = [
    {
        title: "How I Built a 90-Day Banking Prep Plan While Working Full Time",
        author: "Riya Sharma",
        date: "12 Feb 2026",
        readTime: "6 min read",
        summary:
            "A practical weekly plan for pre + mains, including mock-test cadence, revision slots, and current affairs cutoffs.",
    },
    {
        title: "Quant Revision Framework for SBI PO and IBPS PO",
        author: "Arjun Verma",
        date: "28 Jan 2026",
        readTime: "8 min read",
        summary:
            "Topic-priority strategy based on past papers. Includes chapter order, speed targets, and common elimination mistakes.",
    },
    {
        title: "Railway + SSC Overlap Topics You Should Not Study Twice",
        author: "Neha Singh",
        date: "08 Jan 2026",
        readTime: "5 min read",
        summary:
            "A shared-subject roadmap to reduce duplicate preparation and increase retention across multiple government exams.",
    },
];

const studyTips = [
    "Use a 2-1-1 cycle: 2 days concept building, 1 day sectional tests, 1 day deep analysis.",
    "Keep an error notebook with tags: Concept Gap, Calculation Error, Time Mismanagement, Guessing Error.",
    "For reasoning sets, set a 12-minute hard stop; skip and return to avoid losing the section.",
    "Do one mixed mock every Sunday at exact exam time to train your biological clock.",
    "Revise static GK in micro-blocks (15 minutes) instead of long single sessions.",
];

const successStories = [
    {
        name: "Amritendra Mishra",
        background: "B.Tech, Rohilkhand University, Bareilly",
        result:
            "Cleared major banking exams and later qualified additional government recruitment stages with consistent preparation.",
        strategy:
            "Focused on quant fundamentals for 45 days, switched to timed mocks, and maintained a strict post-mock analysis sheet.",
        quote:
            "My turning point was not more study hours, but better review of every wrong question.",
    },
    {
        name: "Pooja Saxena",
        background: "B.Sc Mathematics, Lucknow University",
        result:
            "Cracked IBPS Clerk and reached interview stages in multiple state government exams.",
        strategy:
            "Built speed through daily sectional drills and used topic-wise revision cards for GK and English.",
        quote:
            "Consistency over intensity worked for me. I improved by tracking progress week by week.",
    },
];

const faqItems = [
    {
        q: "How many mock tests should I take every week?",
        a: "For most aspirants, 2 full-length mocks plus 3 sectional tests are enough if analysis quality is high.",
    },
    {
        q: "Can I prepare for banking and SSC together?",
        a: "Yes. Start with overlap topics first: quant basics, reasoning sets, grammar, and daily current affairs.",
    },
    {
        q: "What is the ideal revision ratio?",
        a: "A good target is 60% practice and 40% revision once your fundamentals are clear.",
    },
    {
        q: "How should I manage low-score phases?",
        a: "Reduce test volume for 5-7 days, rebuild with topic drills, then restart full mocks with tighter review.",
    },
];

export default function Resources() {
    const { theme } = useContext(AppContext);
    const isDark = theme === "dark";

    return (
        <div className={`min-h-screen ${isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <div className="container mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Resources</h1>
                    <p className={isDark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
                        Practical material for preparation, revision, and exam strategy.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-3">
                        <div className={`rounded-2xl border p-5 sticky top-24 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                            <h2 className="text-2xl font-bold mb-4">Resources</h2>
                            <nav className="space-y-3">
                                <a href="#blog" className={`block ${isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>Blog</a>
                                <a href="#tips" className={`block ${isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>Study Tips</a>
                                <a href="#stories" className={`block ${isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>Success Stories</a>
                                <a href="#faq" className={`block ${isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>FAQ</a>
                            </nav>
                        </div>
                    </aside>

                    <section className="lg:col-span-9 space-y-8">
                        <div id="blog" className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                            <h3 className="text-2xl font-bold mb-4">Blog</h3>
                            <div className="space-y-4">
                                {blogPosts.map((post) => (
                                    <article
                                        key={post.title}
                                        className={`rounded-xl border p-4 ${isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-gray-50"}`}
                                    >
                                        <h4 className="text-lg font-semibold">{post.title}</h4>
                                        <p className={isDark ? "text-gray-400 text-sm mt-1" : "text-gray-600 text-sm mt-1"}>
                                            {post.author} • {post.date} • {post.readTime}
                                        </p>
                                        <p className={isDark ? "text-gray-300 mt-3" : "text-gray-700 mt-3"}>{post.summary}</p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div id="tips" className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                            <h3 className="text-2xl font-bold mb-4">Study Tips</h3>
                            <ul className="space-y-3">
                                {studyTips.map((tip) => (
                                    <li key={tip} className={isDark ? "text-gray-300" : "text-gray-700"}>
                                        • {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div id="stories" className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                            <h3 className="text-2xl font-bold mb-4">Success Stories</h3>
                            <div className="space-y-4">
                                {successStories.map((story) => (
                                    <article
                                        key={story.name}
                                        className={`rounded-xl border p-4 ${isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-gray-50"}`}
                                    >
                                        <h4 className="text-xl font-semibold">{story.name}</h4>
                                        <p className={isDark ? "text-blue-300 mt-1" : "text-blue-700 mt-1"}>{story.background}</p>
                                        <p className={isDark ? "text-gray-300 mt-3" : "text-gray-700 mt-3"}>{story.result}</p>
                                        <p className={isDark ? "text-gray-300 mt-2" : "text-gray-700 mt-2"}>
                                            <span className="font-semibold">Strategy: </span>
                                            {story.strategy}
                                        </p>
                                        <p className={isDark ? "text-gray-400 mt-3 italic" : "text-gray-600 mt-3 italic"}>
                                            "{story.quote}"
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div id="faq" className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                            <h3 className="text-2xl font-bold mb-4">FAQ</h3>
                            <div className="space-y-4">
                                {faqItems.map((item) => (
                                    <div key={item.q} className={`rounded-xl border p-4 ${isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-gray-50"}`}>
                                        <h4 className="font-semibold">{item.q}</h4>
                                        <p className={isDark ? "text-gray-300 mt-2" : "text-gray-700 mt-2"}>{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
