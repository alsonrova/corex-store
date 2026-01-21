"use client";

import { useState, useEffect } from "react";
import styles from "./TeamSection.module.css";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "online" | "busy" | "away";
  speaking?: boolean;
}

const teamMembers: TeamMember[] = [
  { id: "1", name: "Alex Chen", role: "Lead Developer", status: "online", speaking: false },
  { id: "2", name: "Sarah Mitchell", role: "UI/UX Designer", status: "online", speaking: false },
  { id: "3", name: "Marcus Johnson", role: "Backend Engineer", status: "busy", speaking: false },
  { id: "4", name: "Emma Laurent", role: "Project Manager", status: "online", speaking: false },
  { id: "5", name: "David Park", role: "DevOps Specialist", status: "away", speaking: false },
];

const channels = [
  { id: "general", name: "general", unread: 0 },
  { id: "dev", name: "development", unread: 3 },
  { id: "design", name: "design-review", unread: 0 },
  { id: "deploy", name: "deployments", unread: 1 },
];

export default function TeamSection() {
  const [members, setMembers] = useState(teamMembers);
  const [activeChannel, setActiveChannel] = useState("general");
  const [typingIndicator, setTypingIndicator] = useState(false);

  // Simulate random speaking activity
  useEffect(() => {
    const speakingInterval = setInterval(() => {
      setMembers((prev) => {
        const onlineMembers = prev.filter((m) => m.status === "online");
        if (onlineMembers.length === 0) return prev;

        // Reset all speaking
        const reset = prev.map((m) => ({ ...m, speaking: false }));

        // Randomly select one member to speak
        const randomIndex = Math.floor(Math.random() * onlineMembers.length);
        const speakerId = onlineMembers[randomIndex].id;

        return reset.map((m) => (m.id === speakerId ? { ...m, speaking: true } : m));
      });
    }, 2000);

    return () => clearInterval(speakingInterval);
  }, []);

  // Simulate typing indicator
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setTypingIndicator((prev) => !prev);
    }, 3500);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Column - Team Presentation */}
        <div className={styles.leftColumn}>
          <div className={styles.systemWindow}>
            <div className={styles.windowHeader}>
              <div className={styles.windowControls}>
                <span className={styles.windowDot} data-color="red" />
                <span className={styles.windowDot} data-color="yellow" />
                <span className={styles.windowDot} data-color="green" />
              </div>
              <span className={styles.windowTitle}>COREX://team/profile.sys</span>
              <div className={styles.windowActions}>
                <span className={styles.windowIcon}>◈</span>
              </div>
            </div>

            <div className={styles.windowBody}>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>
                <span className={styles.command}>cat team_info.md</span>
              </div>

              <div className={styles.contentBlock}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleAccent}>Our</span> Team
                </h2>

                <div className={styles.divider}>
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerIcon}>◆</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.description}>
                  Behind every custom build at COREX stands a dedicated team of specialists 
                  united by a shared passion for technology and precision engineering.
                </p>

                <p className={styles.description}>
                  We operate as a cohesive unit—developers, designers, and engineers working 
                  in constant communication to deliver exceptional results. Our collaborative 
                  approach ensures that every project benefits from diverse expertise and 
                  meticulous attention to detail.
                </p>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>5+</span>
                    <span className={styles.statLabel}>Core Members</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>24/7</span>
                    <span className={styles.statLabel}>Coordination</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>100%</span>
                    <span className={styles.statLabel}>Dedication</span>
                  </div>
                </div>

                <div className={styles.tagline}>
                  <span className={styles.taglineIcon}>►</span>
                  <span className={styles.taglineText}>
                    Technology is our craft. Collaboration is our strength.
                  </span>
                </div>
              </div>

              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>
                <span className={styles.cursor}>_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Team Communication UI */}
        <div className={styles.rightColumn}>
          {/* Top Image - COREX Store */}
          <div className={styles.imageFrame}>
            <div className={styles.frameHeader}>
              <span className={styles.frameIcon}>◈</span>
              <span className={styles.frameTitle}>workspace_view.png</span>
              <span className={styles.frameBadge}>LIVE</span>
            </div>
            <div className={styles.frameContent}>
              <img
                src="/corex_inside.png"
                alt="COREX Workspace"
                className={styles.frameImage}
              />
              <div className={styles.frameOverlay} />
            </div>
          </div>

          {/* Middle - Team Communication Interface */}
          <div className={styles.commInterface}>
            <div className={styles.commHeader}>
              <div className={styles.commHeaderLeft}>
                <span className={styles.commIcon}>◈</span>
                <span className={styles.commTitle}>COREX Team Hub</span>
              </div>
              <div className={styles.commHeaderRight}>
                <span className={`${styles.connectionStatus} ${styles.connected}`}>
                  <span className={styles.connectionDot} />
                  Connected
                </span>
              </div>
            </div>

            <div className={styles.commBody}>
              {/* Channels Sidebar */}
              <div className={styles.channelsSidebar}>
                <div className={styles.channelsHeader}>
                  <span className={styles.channelsTitle}>Channels</span>
                </div>
                <div className={styles.channelsList}>
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`${styles.channelItem} ${activeChannel === channel.id ? styles.channelActive : ""}`}
                      onClick={() => setActiveChannel(channel.id)}
                    >
                      <span className={styles.channelHash}>#</span>
                      <span className={styles.channelName}>{channel.name}</span>
                      {channel.unread > 0 && (
                        <span className={styles.channelBadge}>{channel.unread}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.voiceChannel}>
                  <div className={styles.voiceHeader}>
                    <span className={styles.voiceIcon}>🔊</span>
                    <span className={styles.voiceTitle}>Voice: Dev Sync</span>
                  </div>
                  <div className={styles.voiceParticipants}>
                    {members
                      .filter((m) => m.status === "online")
                      .slice(0, 3)
                      .map((member) => (
                        <div
                          key={member.id}
                          className={`${styles.voiceParticipant} ${member.speaking ? styles.speaking : ""}`}
                        >
                          <div className={styles.participantAvatar}>
                            {member.name.charAt(0)}
                            {member.speaking && <span className={styles.speakingRing} />}
                          </div>
                          <span className={styles.participantName}>{member.name.split(" ")[0]}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              <div className={styles.membersPanel}>
                <div className={styles.membersHeader}>
                  <span className={styles.membersTitle}>Team — {members.filter((m) => m.status === "online").length} online</span>
                </div>
                <div className={styles.membersList}>
                  {members.map((member) => (
                    <div key={member.id} className={styles.memberItem}>
                      <div className={styles.memberAvatar}>
                        {member.name.charAt(0)}
                        <span
                          className={styles.memberStatus}
                          data-status={member.status}
                        />
                      </div>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.name}</span>
                        <span className={styles.memberRole}>{member.role}</span>
                      </div>
                      {member.speaking && (
                        <span className={styles.memberSpeaking}>
                          <span className={styles.speakingBars}>
                            <span />
                            <span />
                            <span />
                          </span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {typingIndicator && (
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDots}>
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className={styles.typingText}>Sarah is typing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Image - COREX Team */}
          <div className={styles.imageFrame}>
            <div className={styles.frameHeader}>
              <span className={styles.frameIcon}>◈</span>
              <span className={styles.frameTitle}>team_photo.png</span>
              <span className={styles.frameSize}>2.4 MB</span>
            </div>
            <div className={styles.frameContent}>
              <img
                src="/client_and_customer.png"
                alt="COREX Team"
                className={styles.frameImage}
              />
              <div className={styles.frameOverlay} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
