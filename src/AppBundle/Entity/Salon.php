<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Salon
 *
 * @ORM\Table(name="salon")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SalonRepository")
 */
class Salon
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=5)
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var int
     *
     * @ORM\Column(name="participants_number", type="integer")
     */
    private $participants_number;

    /**
     * @ORM\ManyToOne(targetEntity="Oeuvre")
     * @ORM\JoinColumn(nullable=false)
     */
    private $oeuvre;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="User", cascade={"persist"})
     */
    private $participants;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="date")
     */
    private $start_date;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date", type="date")
     */
    private $end_date;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Salon
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set participantsNumber
     *
     * @param integer $participantsNumber
     *
     * @return Salon
     */
    public function setParticipantsNumber($participantsNumber)
    {
        $this->participants_number = $participantsNumber;

        return $this;
    }

    /**
     * Get participantsNumber
     *
     * @return int
     */
    public function getParticipantsNumber()
    {
        return $this->participants_number;
    }

    /**
     * Set oeuvre
     *
     * @param \AppBundle\Entity\Oeuvre $oeuvre
     *
     * @return Salon
     */
    public function setOeuvre(\AppBundle\Entity\Oeuvre $oeuvre = null)
    {
        $this->oeuvre = $oeuvre;

        return $this;
    }

    /**
     * Get oeuvre
     *
     * @return \AppBundle\Entity\Oeuvre
     */
    public function getOeuvre()
    {
        return $this->oeuvre;
    }

    /**
     * Set user
     *
     * @param \AppBundle\Entity\User $user
     *
     * @return Salon
     */
    public function setUser(\AppBundle\Entity\User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \AppBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->participants = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add participant
     *
     * @param \AppBundle\Entity\User $participant
     *
     * @return Salon
     */
    public function addParticipant(\AppBundle\Entity\User $participant)
    {
        $this->participants[] = $participant;

        return $this;
    }

    /**
     * Remove participant
     *
     * @param \AppBundle\Entity\User $participant
     */
    public function removeParticipant(\AppBundle\Entity\User $participant)
    {
        $this->participants->removeElement($participant);
    }

    /**
     * Get participants
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getParticipants()
    {
        return $this->participants;
    }

    /**
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return Salon
     */
    public function setStartDate($startDate)
    {
        $this->start_date = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->start_date;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate
     *
     * @return Salon
     */
    public function setEndDate($endDate)
    {
        $this->end_date = $endDate;

        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->end_date;
    }
}
